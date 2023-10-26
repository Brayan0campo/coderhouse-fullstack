import mongoose from "mongoose";

const usersCollection = "users";

const userSchema = new mongoose.Schema({
  age: Number,
  role: String,
  email: String,
  password: String,
  firstName: String,
  lastName: String,
});

export const usersModel = mongoose.model(usersCollection, userSchema);
