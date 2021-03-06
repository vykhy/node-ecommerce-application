const mongoose = require("mongoose");
const Order = require("../models/Order");
const Review = require("../models/Review");
const { anyIsEmpty } = require("../services/functions");

// get reviews
exports.getReviews = async (req, res) => {
  const productId = req.params.productId;
  try {
    const reviews = await Review.find({ productId: productId }).populate(
      "userId"
    );
    return res.render("reviews/reviews", { reviews });
  } catch (error) {
    return res.send(error.message);
  }
};

// create a new review
exports.createReview = async (req, res) => {
  const reviewText = req.body.review;
  const userId = req.session.uid;
  let verified = false;
  const productId = mongoose.Types.ObjectId(req.params.productId);

  if (anyIsEmpty([reviewText, userId, productId])) {
    return res.send(
      "Fill all required fields and log in if you are not logged in to leave a review"
    );
  }

  // make sure that user did not change productId in form
  if (!req.headers.referer.split("/").some((string) => string == productId)) {
    return res.send("Dont mess with the source code motherfucker");
  }
  try {
    // check if user has already purchased this product before
    const orders = await Order.find({
      "products._id": productId,
    });
    if (orders.length > 0) verified = true;
    const review = await Review.create({
      userId,
      productId,
      review: reviewText,
      verified,
    });
    return res.send(
      "<div class='container'>Your review was added successfully</div>"
    );
  } catch (error) {
    return res.send(error.message);
  }
  return res.send("Done");
};

// delete review
exports.deleteReview = async (req, res) => {
  const id = mongoose.Types.ObjectId(req.params.productId);
  try {
    const review = await Review.findOneAndDelete({
      _id: id,
      userId: req.session.uid,
    });
    if (review) {
      res.send("Review deleted successfully");
    }
  } catch (error) {
    res.send(error.message);
  }
};
