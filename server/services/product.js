const Product = require("../models/product.model");
const Tag = require("../models/tag.model");
const cloudinary = require("../utils/cloudinary");
const Manufacturer = require("../models/manufacturer.model");

exports.findAll = async (req, res) => {
  try {
    const allProducts = await Product.find().populate([
      {
        path: "tags",
      },
      {
        path: "manufacturer",
      },
    ]);
    res.json(allProducts);
  } catch (error) {
    res.json({
      messageType: "error",
      message: `Problem while getting Products`,
    });
  }
};

exports.findProduct = async (req, res) => {
  try {
    const id = req.params.id;

    let product = await Product.find({ _id: id });
    if (!product) {
      res.json({ messageType: "error", message: `Product not found` });
    }

    product = await Product.find({ _id: id }).populate([
      {
        path: "tags",
      },
      {
        path: "manufacturer",
      },
      {
        path: "reviews",
      },
    ]);
    res.json(product);
  } catch (err) {
    res.json({
      messageType: "error",
      message: `Problem while finding product`,
    });
  }
};
exports.create = async (req, res) => {
  try {
    const files = req.files;

    let uploadedImages = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const result = await cloudinary.uploader.upload(file.path);
      uploadedImages.push(result.secure_url);
    }

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      images: uploadedImages,
      manufacturer: req.body.manufacturer,
      price: req.body.price,
      discount: req.body.discount,
      tags: req.body.tags,
    });

    const manufacturer = await Manufacturer.findById(product.manufacturer);
    manufacturer.products.push(product._id);
    await manufacturer.save();
    product.images = uploadedImages;
    console.log(product.images);
    await product.save();

    return res.json(product);
    // return res.json({ messageType: "success", message: "New Product created" });
  } catch (err) {
    return res.json({ messageType: "error", message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    const files = req.files;

    const product = await Product.find({ _id: id });
    if (!product) {
      res.json({ messageType: "error", message: `Product not found` });
    }

    if (req.files.length > 0) {
      let uploadedImages = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const result = await cloudinary.uploader.upload(file.path);
        uploadedImages.push(result.secure_url);
      }

      console.log(uploadedImages, 'hi')

      console.log(req.body.oldImages);

      await Product.findOneAndUpdate(
        { _id: id },
        {
          name: req.body.name,
          description: req.body.description,
          image: [req.body.oldImages + uploadedImages],
          manufacturer: req.body.manufacturer,
          price: req.body.price,
          discount: req.body.discount,
          tags: req.body.tags,
        },
        {
          returnOriginal: false,
        }
      ).then((data) => {
        !data
          ? res.json({ messageType: "error", message: `Product not found` })
          : // : res.json({
            //     messageType: "success",
            //     message: "Product updated successfully",
            //   });
            res.json(data);
            console.log(data.images)
      });
    } else {
      await Product.findOneAndUpdate(
        { _id: id },
        {
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          discount: req.body.discount,
          manufacturer: req.body.manufacturer,
          tags: req.body.tags,
        },
        {
          returnOriginal: false,
        }
      ).then((data) => {
        !data
          ? res.json({ messageType: "error", message: `Product not found` })
          : // : res.json({
            //     messageType: "success",
            //     message: "Product updated successfully",
            //   });
            res.json(data);
      });
    }
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
};

exports.delete = (req, res) => {
  try {
    const id = req.params.id;

    Product.findByIdAndDelete(id)
      .then((data) => {
        !data
          ? res.json({ messageType: "error", message: `Product not found` })
          : res.send({
              messageType: "success",
              message: "Product was deleted successfully!",
            });
      })
      .catch((err) => {
        res.send({
          messageType: "error",
          message: "Sorry, Problem while deleting product",
        });
      });
  } catch (error) {
    res.json({
      messageType: "error",
      message: "Sorry, Problem while deleting product",
    });
  }
};
