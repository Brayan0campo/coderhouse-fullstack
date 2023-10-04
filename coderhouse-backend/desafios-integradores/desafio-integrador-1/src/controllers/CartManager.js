import { promises as fs } from "fs";
import { nanoid } from "nanoid";
import ProductManager from "./ProductManager.js";

const productManager = new ProductManager();

class CartManager {
  constructor() {
    this.path = "./src/models/cart.json";
  }

  validateCart = async (id) => {
    let carts = await this.readCart();
    return carts.find((cart) => cart.id === id);
  };

  readCart = async () => {
    const carts = await fs.readFile(this.path, "utf-8");
    return JSON.parse(carts);
  };

  writeCart = async (cart) => {
    await fs.writeFile(this.path, JSON.stringify(cart));
  };

  getCart = async () => {
    return await this.readCart();
  };

  getCartById = async (id) => {
    let cartId = await this.validateCart(id);
    if (!cartId) return "Carrito no encontrado";
    return cartId;
  };

  addCart = async () => {
    let cartAdd = await this.readCart();
    let id = nanoid();

    let cartConcat = [{ id: id, products: [] }, ...cartAdd];
    await this.writeCart(cartConcat);
    return "Carrito agregado";
  };

  addProductInCart = async (cartId, productId) => {
    let cartIdValidate = await this.validateCart(cartId);
    if (!cartIdValidate) return "Carrito no encontrado";

    let productIdValidate = await productManager.validateProduct(productId);
    if (!productIdValidate) return "Producto no encontrado";

    let cartAll = await this.getCart();
    let cartFilter = cartAll.filter((cart) => cart.id != cartId);
    if (cartIdValidate.products.some((prod) => prod.id === productId)) {
      let addProduct = cartIdValidate.products.find(
        (prod) => prod.id === productId
      );
      addProduct.quantity++;
      let cartConcat = [cartIdValidate, ...cartFilter];
      await this.writeCart(cartConcat);
      return "Producto agregado en el carrito";
    }

    cartIdValidate.products.push({ id: productId, quantity: 1 });
    let cartConcat = [cartIdValidate, ...cartFilter];
    await this.writeCart(cartConcat);
    return "Producto en el carrito";
  };
}

export default CartManager;
