var mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  stars: {
    type: String,
    required: true
  },
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
