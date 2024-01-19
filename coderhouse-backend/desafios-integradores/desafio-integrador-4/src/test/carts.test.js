import Assert from "assert";
import * as Chai from "chai";
import mongoose from "mongoose";
import supertest from "supertest";
import config from "../config/config.js";
import Cart from "../dao/mongo/carts.mongo.js";

mongoose.connect(config.MONGO_URL);

const expect = Chai.expect;
const assert = Assert.strict;
const request = supertest("http://localhost:8080");

describe("Testing Carts", () => {
  before(function () {
    this.cartsDB = new Cart();
  });
  it("Should return a carts from db", async function () {
    this.timeout(5000);
    try {
      const carts = await this.cartsDB.get();
      assert.strictEqual(Array.isArray(carts), true);
      expect(Array.isArray(carts)).to.be.equals(true);
    } catch (error) {
      assert.fail(error.message);
      console.error("Testing Error: ", error);
    }
  });
  it("Should return a cart from db", async function () {
    this.timeout(5000);
    try {
      const cart = await this.cartsDB.getCart("656ab5e08c53878ae307610e");
      assert.strictEqual(typeof cart, "object");
      expect(typeof cart).to.be.equals("object");
    } catch (error) {
      assert.fail(error.message);
      console.error("Testing Error: ", error);
    }
  });
  it("Should return a stock from db", async function () {
    this.timeout(5000);
    try {
      const products = [
        {
          description: "Portatil",
          stock: 10,
        },
      ];
      const stock = await this.cartsDB.getStock({ products: products });
      expect(stock[products[0].description].status).to.equal("ok");
    } catch (error) {
      assert.fail(error.message);
      console.error("Testing Error: ", error);
    }
  });
  it("should return a amount from db", async function () {
    this.timeout(5000);
    try {
      const products = [
        {
          description: "Iphone 12",
          price: 500,
          stock: 10,
        },
        {
          description: "Portatil",
          price: 500,
          stock: 10,
        },
      ];
      const amount = await this.cartsDB.getAmount({ products: products });
      expect(amount).to.equal(1000);
      expect(amount).to.be.a("number");
      assert.strictEqual(typeof amount, "number");
    } catch (error) {
      assert.fail(error.message);
      console.error("Testing Error: ", error);
    }
  });
  it("should create a cart in db", async function () {
    try {
      let cartAdd = {
        products: [
          {
            productId: "659e1f99ecd19459ed08cf13",
            quantity: 2,
          },
        ],
      };
      const cart = await request.post("/carts").send(cartAdd);
      assert.strictEqual(cart.status, 200);
      expect(cart.ok).to.equal(true);
      expect(cart.body).to.have.property("status", "success");
    } catch (error) {
      assert.fail(error.message);
      console.error("Testing Error: ", error);
    }
  });
  it("should update a cart in db", async function () {
    try {
      let cartUpdate = {
        products: [
          {
            productId: "656ab0d021e9ae67c5323ae2",
            quantity: 10,
          },
        ],
      };
      const cart = await request
        .put("/carts/656ab5e08c53878ae307610e")
        .send(cartUpdate);
      assert.strictEqual(cart.status, 200);
      expect(cart.status).to.be.equals(200);
      expect(cart.body).to.have.property("status", "success");
    } catch (error) {
      assert.fail(error.message);
      console.error("Testing Error: ", error);
    }
  });
  it("should delete a cart in db", async function () {
    try {
      const cart = await request.delete("/carts/656abcb1d6dadfcbf11b2df8");
      assert.strictEqual(cart.status, 200);
      expect(cart.status).to.be.equals(200);
      expect(cart.body).to.have.property("status", "success");
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
