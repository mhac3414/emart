const Product = require("../models/product.model");
const Manufacturer = require("../models/manufacturer.model");

exports.findAll = async (req, res) => {
  try {
    const allManufacturers = await Manufacturer.find().populate("products");
    res.json(allManufacturers);
  } catch (error) {
    res.json({
      messageType: "error",
      message: `Problem while getting Manufacturers`,
    });
  }
};

exports.findManufacturer = async (req, res) => {
  try {
    const id = req.params.id;

    let manufacturer = await Manufacturer.find({ _id: id }).populate(
      "products"
    );
    if (!manufacturer) {
      res.json({ messageType: "error", message: `Manufacturer not found` });
    }
    res.json(manufacturer);
  } catch (err) {
    res.json({
      messageType: "error",
      message: `Error while getting Manufacturer`,
    });
  }
};

exports.create = async (req, res) => {
  try {
    const manufacturer = new Manufacturer({
      name: req.body.name,
      description: req.body.description,
    });
    await manufacturer.save();
    res.json({ messageType: "success", message: "New Manufacturer created" });
  } catch (err) {
    res.json({
      messageType: "error",
      message: `Sorry, Problem while creating new Manufacturer`,
    });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    let manufacturer = await Manufacturer.find({ _id: id });
    if (!manufacturer) {
      return res.json({
        messageType: "error",
        message: `Manufacturer not found`,
      });
    }

    await Manufacturer.findOneAndUpdate(
      { _id: id },
      {
        name: req.body.name,
        description: req.body.description,
      },
      { returnOriginal: false }
    ).then((data) => {
      !data
        ? res.json({ messageType: "error", message: `Manufacturer not found` })
        : res.json({
            messageType: "success",
            message: "Manufacturer updated successfully!",
          });
    });
  } catch (err) {
    res.json({
      messageType: "error",
      message: "Sorry, Cannot update Manufacturer",
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    let manufacturer = await Manufacturer.findById({ _id: id });
    const allProducts = await Product.find();
    if (!manufacturer) {
      return res.json({
        messageType: "error",
        message: `Manufacturer not found`,
      });
    }

    let hasProducts = false;

    for (let i = 0; i < allProducts.length; i++) {
      const singleProduct = allProducts[i];

      if (String(singleProduct.manufacturer) === String(manufacturer._id)) {
        hasProducts = true;
        break; // Exit the loop early if any associated product is found
      }
    }

    if (hasProducts) {
      return res.json({
        messageType: "error",
        message: `Sorry, Manufacturer has some products`,
      });
    }

    await Manufacturer.findByIdAndDelete(id).then((data) => {
      if (!data) {
        res.json({ messageType: "error", message: `Manufacturer not found` });
      } else {
        res.send({
          messageType: "success",
          message: "Manufacturer deleted successfully!",
        });
      }
    });
  } catch (err) {
    res.json({
      messageType: "error",
      message: "Sorry, cannot delete Manufacturer",
    });
    console.log(err);
  }
};
