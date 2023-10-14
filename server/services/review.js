const Product = require("../models/product.model");
const Review = require("../models/review.model");

exports.findAll = async (req, res) => {
  try {
    const allReviews = await Review.find();
    res.json(allReviews);
  } catch (error) {
    res.json({
      messageType: "error",
      message: `Problem while getting Reviews`,
    });
  }
};

exports.findReview = async (req, res) => {
  try {
    const id = req.params.id;

    let review = await Review.find({ _id: id });
    if (!review) {
      res.json({ messageType: "error", message: `Review not found` });
    }
    res.json(review);
  } catch (err) {
    res.json({
      messageType: "error",
      message: `Error while getting Review`,
    });
  }
};

exports.create = async (req, res) => {
  try {
    const review = new Review({
      name: req.body.name,
      text: req.body.text,
      stars: req.body.stars,
    });
    await review.save();
    res.json({ messageType: "success", message: "New Review created" });
  } catch (err) {
    res.json({
      messageType: "error",
      message: `Sorry, Problem while creating new Review`,
    });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    let review = await Review.find({ _id: id });
    if (!review) {
      return res.json({
        messageType: "error",
        message: `Review not found`,
      });
    }

    await Review.findOneAndUpdate(
      { _id: id },
      {
        name: req.body.name,
        text: req.body.text,
        stars: req.body.stars,
      },
      { returnOriginal: false }
    ).then((data) => {
      !data
        ? res.json({ messageType: "error", message: `Review not found` })
        : res.json({
            messageType: "success",
            message: "Review updated successfully!",
          });
    });
  } catch (err) {
    res.json({
      messageType: "error",
      message: "Sorry, Cannot update Review",
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    let review = await Review.findById({ _id: id });

    if (!review) {
      return res.json({
        messageType: "error",
        message: `Review not found`,
      });
    }

    await Review.findByIdAndDelete(id).then((data) => {
      !data
        ? res.json({ messageType: "error", message: `Review not found` })
        : res.send({
            messageType: "success",
            message: "Review deleted successfully!",
          });
    });
  } catch (err) {
    res.json({
      messageType: "error",
      message: "Sorry, cannot delete Review",
    });
    console.log(err);
  }
};
