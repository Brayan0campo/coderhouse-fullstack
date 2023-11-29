import ProductDTO from "../dao/dtos/products.dto";

export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getAllProducts() {
    const products = await this.dao.getAllProducts();
    return products;
  }

  async getProductById(id) {
    const product = await this.dao.getProductById(id);
    return product;
  }

  async createProduct(product) {
    const productDTO = new ProductDTO(product);
    const newProduct = await this.dao.createProduct(productDTO);
    return newProduct;
  }

  async updateProduct(id, product) {
    const productDTO = new ProductDTO(product);
    const updatedProduct = await this.dao.updateProduct(id, productDTO);
    return updatedProduct;
  }

  async deleteProduct(id) {
    const deletedProduct = await this.dao.deleteProduct(id);
    return deletedProduct;
  }
}
