const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    name: {
      type: String,
      min: 4,
      max: 30,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    admin: {
      type: Boolean,
      default: false,
      required: false,
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
    addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
    payments: [],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", User);
