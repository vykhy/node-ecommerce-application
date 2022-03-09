const router = require("express").Router();
const reviewController = require("../controllers/reviewController");

// get reviews
router.get("/:productId", reviewController.getReviews);

// add a review
router.post("/:productId", reviewController.createReview);

module.exports = router;
