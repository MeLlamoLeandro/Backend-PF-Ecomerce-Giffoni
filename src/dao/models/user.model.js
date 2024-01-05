import mongoose from "mongoose";

const usersCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
  },
  age: Number,
  password: String,
  cart: {
    type: String,
    ref: "carts",
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin", "premium"],
  },
  avatar: String,

  documents: [
    {
      name: String, //nombre del documento
      reference: String, //link al documento
    },
  ],
  last_connection: Date,

  status: {
    type: {
      id_doc: Boolean,
      address_doc: Boolean,
      account_doc: Boolean,
      _id: false,
    },
    default: {
      id_doc: false,
      address_doc: false,
      account_doc: false,
    },
  },
});

userSchema.pre("findOne", function () {
  this.populate("cart");
});

export const userModel = mongoose.model(usersCollection, userSchema);
