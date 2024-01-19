import mongoose from "mongoose";

const usersCollection = "users";

const userSchema = new mongoose.Schema({
  password: String,
  firstName: String,
  lastName: String,
  email: String,
  age: Number,
  role: {
    type: String,
    enum: ["user", "admin", "premium"],
    default: "user",
  },
  documents: [
    {
      name: { type: String },
      reference: { type: String },
    },
  ],
  lastconnection: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

export const usersModel = mongoose.model(usersCollection, userSchema);
