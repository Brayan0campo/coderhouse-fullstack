export default class ProductDTO {
  constructor(product) {
    this.description = product.description;
    this.available = product.available;
    this.category = product.category;
    this.price = product.price;
    this.stock = product.stock;
  }
}
