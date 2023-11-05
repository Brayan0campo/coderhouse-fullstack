import mongoose from "mongoose";

const usersCollection = "users";

const userSchema = new mongoose.Schema({
  age: Number,
  role: String,
  email: String,
  password: String,
  lastName: String,
  firstName: String,

  cart: [
    {
      type: [
        {
          cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "carts",
          },
        },
      ],
    },
  ],
});

export const usersModel = mongoose.model(usersCollection, userSchema);
