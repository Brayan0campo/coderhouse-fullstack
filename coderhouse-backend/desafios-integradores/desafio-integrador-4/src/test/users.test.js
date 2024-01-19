import Assert from "assert";
import * as Chai from "chai";
import mongoose from "mongoose";
import supertest from "supertest";
import config from "../config/config.js";
import Users from "../dao/mongo/users.mongo.js";

mongoose.connect(config.MONGO_URL);

const expect = Chai.expect;
const assert = Assert.strict;
const request = supertest("http://localhost:8080");

describe("Testing Users", () => {
  before(function () {
    this.usersDB = new Users();
  });
  it("Should return a users from db", async function () {
    this.timeout(5000);
    try {
      const users = await this.usersDB.get();
      assert.strictEqual(Array.isArray(users), true);
      expect(Array.isArray(users)).to.be.equals(true);
    } catch (error) {
      assert.fail(error.message);
      console.error("Testing Error: ", error);
    }
  });
  it("Should return a user from db", async function () {
    this.timeout(5000);
    try {
      const user = await this.usersDB.getById("656aa878834d64380d298aed");
      assert.strictEqual(typeof user, "object");
      expect(typeof user).to.be.equals("object");
    } catch (error) {
      assert.fail(error.message);
      console.error("Testing Error: ", error);
    }
  });
  it("Should return a user by email from db", async function () {
    this.timeout(5000);
    try {
      const email = "ocamporodriguezbrayan@gmail.com";
      const user = await this.usersDB.findByEmail({ email: email });
      assert.strictEqual(typeof user, "object");
      expect(typeof user).to.be.equals("object");
    } catch (error) {
      assert.fail(error.message);
      console.error("Testing Error: ", error);
    }
  });
  it("Should create a user in db", async function () {
    this.timeout(5000);
    try {
      const newUser = await this.usersDB.createUser({
        firstName: "Brayan",
        lastName: "Ocampo",
        email: "example@gmail.com",
        role: "admin",
        age: "25",
        password: "123456",
      });
      assert.strictEqual(typeof newUser, "object");
      expect(typeof newUser).to.be.equals("object");
    } catch (error) {
      assert.fail(error.message);
      console.error("Testing Error: ", error);
    }
  });
  it("Should update a user in db", async function () {
    this.timeout(5000);
    try {
      const updatedUser = await this.usersDB.updateUser(
        "656aa878834d64380d298aed",
        {
          firstName: "Brayan",
          lastName: "Ocampo",
          email: "ocamporodriguezbrayan@gmail.com",
          role: "user",
          age: "25",
          password: "123456",
        }
      );
      assert.strictEqual(typeof updatedUser, "object");
      expect(typeof updatedUser).to.be.equals("object");
    } catch (error) {
      assert.fail(error.message);
      console.error("Testing Error: ", error);
    }
  });
  it("Should delete a user in db", async function () {
    this.timeout(5000);
    try {
      const deletedUser = await this.usersDB.deleteUser(
        "656ac6a290ad1e99ebc716fe"
      );
      assert.strictEqual(typeof deletedUser, "object");
      expect(typeof deletedUser).to.be.equals("object");
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
