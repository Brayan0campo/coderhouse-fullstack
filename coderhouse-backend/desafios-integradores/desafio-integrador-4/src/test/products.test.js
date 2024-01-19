import Assert from "assert";
import * as Chai from "chai";
import mongoose from "mongoose";
import supertest from "supertest";
import config from "../config/config.js";
import Products from "../dao/mongo/products.mongo.js";

mongoose.connect(config.MONGO_URL);

const expect = Chai.expect;
const assert = Assert.strict;
const request = supertest("http://localhost:8080");

describe("Testing Products", () => {
  before(function () {
    this.productsDB = new Products();
  });
  it("Should return a products from db", async function () {
    this.timeout(5000);
    try {
      const products = await this.productsDB.get();
      assert.strictEqual(Array.isArray(products), true);
      expect(Array.isArray(products)).to.be.equals(true);
    } catch (error) {
      assert.fail(error.message);
      console.error("Testing Error: ", error);
    }
  });
  it("Should return a product from db", async function () {
    this.timeout(5000);
    try {
      const product = await this.productsDB.getProduct(
        "656ab0d021e9ae67c5323ae2"
      );
      assert.strictEqual(typeof product, "object");
      expect(typeof product).to.be.equals("object");
    } catch (error) {
      assert.fail(error.message);
      console.error("Testing Error: ", error);
    }
  });
  it("Should create a product in db", async function () {
    this.timeout(5000);
    try {
      const newProduct = await this.productsDB.createProduct({
        description: "Asus Rog Strix G15",
        category: "Notebook",
        price: 2000,
        stock: 10,
        available: "in_stock",
        owner: "",
      });
      assert.strictEqual(typeof newProduct, "object");
      expect(typeof newProduct).to.be.equals("object");
    } catch (error) {
      assert.fail(error.message);
      console.error("Testing Error: ", error);
    }
  });
  it("Should update a product in db", async function () {
    this.timeout(5000);
    try {
      const updatedProduct = await this.productsDB.updateProduct(
        "658e5660c553ff980745dc6a",
        {
          description: "Tablet",
          category: "Electronic",
          price: 200,
          stock: 20,
          available: "in_stock",
          owner: "admin",
        }
      );
      assert.strictEqual(typeof updatedProduct, "object");
      expect(typeof updatedProduct).to.be.equals("object");
    } catch (error) {
      assert.fail(error.message);
      console.error("Testing Error: ", error);
    }
  });
  it("Should delete a product in db", async function () {
    this.timeout(5000);
    try {
      const deletedProduct = await this.productsDB.deleteProduct(
        "658e5660c553ff980745dc6a"
      );
      assert.strictEqual(typeof deletedProduct, "object");
      expect(typeof deletedProduct).to.be.equals("object");
    } catch (error) {
      assert.fail(error.message);
      console.error("Testing Error: ", error);
    }
  });
  after(function (done) {
    this.timeout(5000);
    done();
  });
});
