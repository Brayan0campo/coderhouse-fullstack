export default class ProductDTO {
  constructor(description, category, price, stock, available, owner) {
    this.description = description;
    this.category = category;
    this.price = price;
    this.stock = stock;
    this.available = available;
    this.owner = owner;
  }
}
