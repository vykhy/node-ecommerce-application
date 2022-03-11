const router = require("express").Router();
const reviewController = require("../controllers/reviewController");

// get reviews
router.get("/:productId", reviewController.getReviews);

// add a review
router.post("/:productId", reviewController.createReview);

//delete a review
router.get("/delete/:productId", reviewController.deleteReview);

module.exports = router;
