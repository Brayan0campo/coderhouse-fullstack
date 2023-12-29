import mongoose from "mongoose";

const usersCollection = "users";

const userSchema = new mongoose.Schema({
  password: String,
  firstName: String,
  lastName: String,
  email: String,
  role: {
    type: String,
    enum: ["user", "admin", "premium"],
    default: "user",
  },
  age: Number,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

export const usersModel = mongoose.model(usersCollection, userSchema);
