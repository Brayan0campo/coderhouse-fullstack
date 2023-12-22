import mongoose from "mongoose";

const usersCollection = "users";

const userSchema = new mongoose.Schema({
  password: String,
  firstName: String,
  lastName: String,
  email: String,
  role: String,
  age: Number,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

export const usersModel = mongoose.model(usersCollection, userSchema);
