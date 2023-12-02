export default class ProductDTO {
  constructor(description, category, price, stock, available) {
    this.description = description;
    this.category = category;
    this.price = price;
    this.stock = stock;
    this.available = available;
  }
}
