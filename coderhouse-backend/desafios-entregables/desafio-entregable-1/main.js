class ProductManager {
  constructor() {
    this.products = [];
  }

  static id = 0;

  addProduct(title, description, price, thumbnail, code, stock) {
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].code === code) {
        console.log(`El codigo ${code} ya existe`);
        break;
      }
    }

    const newProduct = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    if (!Object.values(newProduct).includes(undefined)) {
      this.products.push({
        ...newProduct,
        id: ++ProductManager.id,
      });
    } else {
      console.log("Todos los campos son obligatorios");
    }
  }

  getProducts() {
    return this.products;
  }

  productExists(id) {
    return this.products.find((product) => product.id === id);
  }

  getProductById(id) {
    !this.productExists(id)
      ? console.log("Not found")
      : console.log(this.productExists(id));
  }
}

// Crear instancia de la clase
const product = new ProductManager();

// Mostrar arreglo vacío
console.log(product.getProducts());

// Agregar un producto con el metodo addProduct
product.addProduct("Camisa", "Camisa de manga larga", 100, "imagenCamisa", "C123", 10);
product.addProduct("Pantalon", "Pantalon de cuero", 500, "imagenPantalon", "P123", 6);

// Mostrar todos los productos
console.log(product.getProducts());

// Agregar un producto con codigo existente
product.addProduct("Zapatos", "Zapatos deportivos", 800, "imagenZapatos", "P123", 8);

// Buscar un producto por id
product.getProductById(2);

// Buscar un producto por id no existente
product.getProductById(5);

