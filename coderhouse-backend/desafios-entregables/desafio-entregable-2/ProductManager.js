import { promises as fs } from "fs";

class ProductManager {
  constructor() {
    this.patch = "./ProductsManager.txt";
    this.products = [];
  }

  static id = 0;

  addProduct = async (title, description, price, thumbnail, code, stock) => {
    ProductManager.id++;

    let newProduct = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      id: ProductManager.id,
    };

    this.products.push(newProduct);

    await fs.writeFile(this.patch, JSON.stringify(this.products));
  };

  readProducts = async () => {
    let responseRead = await fs.readFile(this.patch, "utf-8");
    return JSON.parse(responseRead);
  };

  getProducts = async () => {
    let responseGet = await this.readProducts();
    return await console.log(responseGet);
  };

  getProductsById = async (id) => {
    let responseGetId = await this.readProducts();
    let filterProdById = responseGetId.find((product) => product.id === id);

    if (!filterProdById) {
      console.log("Producto no encontrado");
    } else {
      console.log(filterProdById);
    }
  };

  deleteProductsById = async (id) => {
    let responseProd = await this.readProducts();
    let productFilter = responseProd.filter((products) => products.id != id);

    if (productFilter.length === responseProd.length) {
      console.log("No se encontró producto con el ID " + id);
    } else {
      await fs.writeFile(this.patch, JSON.stringify(productFilter));
      console.log("Producto eliminado: " + id);
    }
  };

  updateProducts = async ({ id, ...productUpdate }) => {
    await this.deleteProductsById(id);
    let responseProd = await this.readProducts();
    let prodUpdate = [{ id, ...productUpdate }, ...responseProd];
    await fs.writeFile(this.patch, JSON.stringify(prodUpdate));
  };
}

const products = new ProductManager();

// Agregar productos con el metodo addProduct
// products.addProduct("Camisa", "Camisa de manga corta", 100, "imagenCamisa", "C123", 10);
// products.addProduct("Pantalon", "Pantalon de cuero", 500, "imagenPantalon", "P123", 6);
// products.addProduct("Zapatos", "Zapatos de cuero", 1000, "imagenZapatos", "Z123", 7);
// products.addProduct("Botas", "Botas de cuero", 500, "imagenBotas", "B123", 8);
// products.addProduct("Blusa", "Blusa amarilla", 100, "imagenBlusa", "BL123", 9);
// products.addProduct("Falda", "Falda negra", 500, "imagenFalda", "F123", 10);
// products.addProduct("Medias", "Medias largas", 100, "imagenMedias", "M123", 10);
// products.addProduct("Gorra", "Gorra negra", 300, "imagenGorra", "G123", 17);
// products.addProduct("Chaqueta", "Chaqueta de cuero", 1000, "imagenChaqueta", "CH123", 5);
// products.addProduct("Collar", "Collar de perlas", 500, "imagenCollar", "CO123", 10);

// Mostrar todos los productos
// products.getProducts();

// Buscar un producto por id
// products.getProductsById(3);

// Eliminar un producto por id
// products.deleteProductsById(2);

// Actualizar un producto
/* products.updateProducts({
  title: "Camisa",
  description: "Camisa de manga corta",
  price: 500,
  thumbnail: "imagenCamisa",
  code: "C123",
  stock: 12,
  id: 1,
}); */
