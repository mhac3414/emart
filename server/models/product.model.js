var mongoose = require("mongoose");
(slug = require("mongoose-slug-updater")), mongoose.plugin(slug);
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    slug: {
      type: String,
      slug: "name",
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    images: { type: Array, required: true },
    manufacturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Manufacturer",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
        // required: true
      },
    ],
  },
  { timestamps: true }
);

const product = mongoose.model("Product", productSchema);
module.exports = product;
