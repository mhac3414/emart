const Product = require("../models/product.model");
const Tag = require("../models/tag.model");

exports.findAll = async (req, res) => {
  try {
    const allTags = await Tag.find();
    res.json(allTags);
  } catch (error) {
    res.json({ messageType: "error", message: `Problem while getting Tags` });
  }
};

exports.findTag = async (req, res) => {
  try {
    const id = req.params.id;

    let tag = await Tag.find({ _id: id });
    if (!tag) {
      res.json({ messageType: "error", message: `Tag not found` });
    }

    res.json(tag);
  } catch (err) {
    res.json({ messageType: "error", message: `Tag not found` });
  }
};

exports.create = async (req, res) => {
  try {
    const tag = new Tag({
      title: req.body.title,
      description: req.body.description,
    });
    await tag.save();
    res.json({ messageType: "success", message: "New Tag created" });
  } catch (err) {
    res.json({
      messageType: "error",
      message: `Sorry, Problem while creating new Tag`,
    });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    let tag = await Tag.find({ _id: id });
    if (!tag) {
      return res.json({ messageType: "error", message: `Tag not found` });
    }

    await Tag.findOneAndUpdate(
      { _id: id },
      {
        title: req.body.title,
        description: req.body.description,
      },
      { returnOriginal: false }
    ).then((data) => {
      !data
        ? res.json({ messageType: "error", message: `Tag not found` })
        : res.json({
            messageType: "success",
            message: "Tag updated successfully!",
          });
    });
  } catch (err) {
    res.json({ messageType: "error", message: "Sorry, Cannot update Tag" });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    let tag = await Tag.findById(id);
    const allProducts = await Product.find();

    if (!tag) {
      return res.json({ messageType: "error", message: `Tag not found` });
    }

    let hasProducts = false;

    for (let i = 0; i < allProducts.length; i++) {
      const singleProduct = allProducts[i];

      singleProduct.tags.map((singleTag) => {
        if (String(singleTag) === String(tag._id)) {
          hasProducts = true;
        }
      });
    }

    if (hasProducts) {
      return res.json({
        messageType: "error",
        message: "Sorry, Tag is included in some products",
      });
    }

    await Tag.findByIdAndDelete(id).then((data) => {
      if (!data) {
        res.json({ messageType: "error", message: `Tag not found` });
      } else {
        res.send({
          messageType: "success",
          message: "Tag deleted successfully!",
        });
      }
    });
  } catch (err) {
    res.json({
      messageType: "error",
      message: "Sorry, cannot delete Tag",
    });
    console.log(err);
  }
};
