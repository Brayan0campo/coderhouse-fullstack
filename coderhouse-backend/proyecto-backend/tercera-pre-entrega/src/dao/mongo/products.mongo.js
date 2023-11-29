import productsModel from "./models/products.model.js";

export default class ProductsMongo {
  constructor() {}

  get = async () => {
    try {
      const products = await productsModel.find().lean();
      return products;
    } catch (err) {
      console.log(err);
    }
  };

  getById = async (id) => {
    try {
      const product = await productsModel.findById(id);
      return product;
    } catch (err) {
      console.log(err);
    }
  };

  createProduct = async (newProduct) => {
    try {
      const newProduct = await productsModel.create(newProduct);
      return newProduct;
    } catch (err) {
      console.log(err);
    }
  };

  updateProduct = async (id, product) => {
    try {
      const updatedProduct = await productsModel.findByIdAndUpdate(
        id,
        product,
        {
          new: true,
        }
      );
      return updatedProduct;
    } catch (err) {
      console.log(err);
    }
  };

  deleteProduct = async (id) => {
    try {
      const deletedProduct = await productsModel.findByIdAndDelete(id);
      return deletedProduct;
    } catch (err) {
      console.log(err);
    }
  };
}
