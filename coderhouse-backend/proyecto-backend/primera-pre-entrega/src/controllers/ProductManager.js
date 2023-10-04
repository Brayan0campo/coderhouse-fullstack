import { promises as fs } from "fs";
import { nanoid } from "nanoid";

class ProductManager {
  constructor() {
    this.path = "./src/models/products.json";
  }

  validateProduct = async (id) => {
    let products = await this.readProduct();
    return products.find((prod) => prod.id === id);
  };

  readProduct = async () => {
    let products = await fs.readFile(this.path, "utf-8");
    return JSON.parse(products);
  };

  writeProduct = async (products) => {
    await fs.writeFile(this.path, JSON.stringify(products));
  };

  getProduct = async () => {
    return await this.readProduct();
  };

  getProductById = async (id) => {
    let productId = await this.validateProduct(id);
    if (!productId) return "Producto no encontrado";
    return productId;
  };

  addProduct = async (product) => {
    if (
      !product.title ||
      !product.description ||
      !product.code ||
      !product.price ||
      !product.stock ||
      !product.category
    ) {
      return "Faltan campos obligatorios";
    }

    let products = await this.readProduct();
    product.id = nanoid();

    let addProduct = [...products, product];
    await this.writeProduct(addProduct);
    return "Producto agregado";
  };

  updateProduct = async (id, product) => {
    let productId = await this.validateProduct(id);
    if (!productId) return "Producto no encontrado";

    await this.deleteProduct(id);
    let productCurrent = await this.readProduct();
    let productUpdate = [{ id: id, ...product }, ...productCurrent];
    await this.writeProduct(productUpdate);
    return "Producto actualizado";
  };

  deleteProduct = async (id) => {
    let products = await this.readProduct();
    let validateProd = products.some((prod) => prod.id === id);

    if (validateProd) {
      let productDelete = products.filter((prod) => prod.id != id);
      await this.writeProduct(productDelete);
      return "Producto eliminado";
    }
    return "Producto no encontrado";
  };
}

export default ProductManager;
