export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  get = async () => {
    try {
      const products = await this.dao.get();
      return products;
    } catch (error) {
      console.error("Error getting products: ", error);
      return "Error getting products";
    }
  };

  getProduct = async (id) => {
    try {
      const product = await this.dao.getProduct(id);
      if (!product) {
        return { error: "Product not found" };
      }
      return product;
    } catch (error) {
      console.error("Error getting product: ", error);
      return "Error getting product";
    }
  };

  createProduct = async (product) => {
    try {
      const createdProduct = await this.dao.createProduct(product);
      return createdProduct;
    } catch (error) {
      console.error("Error creating product: ", error);
      throw new Error("Error creating product");
    }
  };

  updateProduct = async (id, product) => {
    try {
      const updatedProduct = await this.dao.updateProduct(id, product);
      return updatedProduct;
    } catch (error) {
      console.error("Error updating product: ", error);
      return "Error updating product";
    }
  };

  deleteProduct = async (id) => {
    try {
      const deletedProduct = await this.dao.deleteProduct(id);
      return deletedProduct;
    } catch (error) {
      console.error("Error deleting product: ", error);
      return "Error deleting product";
    }
  };
}
