const mongoose = require("mongoose");

const Order = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true
    },
    products: [],
    status: {
      type: String,
      default: "initiated",
    },
    stage: {
      type: String,
      default: "started", // started  || address  || paid
    },
    total: {
      type: Number,
      required: true,
      default: 0,
    },
    address: {
      country: {
        type: String,
      },
      province: {
        type: String,
      },
      city: {
        type: String,
      },
      street1: {
        type: String,
      },
      street2: {
        type: String,
      },
      zip: {
        type: String,
      },
    },
    deleted: { type: Boolean, default: false },
    trackingId: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", Order);
