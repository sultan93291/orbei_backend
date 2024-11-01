/*
 * Product Schema for MongoDB
 * Author: Md. Abib Ahmed Dipto
 * Date: 01-11-2024
 * Description: Defines the structure of the Product documents in the database, including fields for name, description, category, price, rating, and related owner and merchant information.
 */

const mongoose = require("mongoose");
const { Schema, model, models } = mongoose;

// Product schema definition
const productSchema = new Schema(
  {
    // Product name
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    // Product description
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },

    // Category reference (foreign key)
    category: {
      type: mongoose.Types.ObjectId,
      ref: "category",
      required: [true, "Product category is required"],
    },

    // Optional sub-category reference (foreign key)
    subCategory: {
      type: mongoose.Types.ObjectId,
      ref: "sub_category",
    },

    // Product price
    price: {
      type: String,
      required: [true, "Product price is required"],
      trim: true,
    },

    // Optional discount price for the product
    discountPrice: {
      type: String,
      trim: true,
    },

    // Product rating (default is 0)
    rating: {
      type: Number,
      default: 0,
    },

    // Array of review strings
    review: [
      {
        type: String,
      },
    ],

    // Owner of the product (user reference)
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: [true, "Owner ID is required"],
    },

    // Merchant who added the product (merchant reference)
    merchantId: {
      type: mongoose.Types.ObjectId,
      ref: "merchant",
      required: [true, "Merchant ID is required"],
    },

    // Product image URL
    image: {
      type: String,
      required: [true, "Product image is required"],
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Model definition, reuses model if already defined
const productModel = models.product || model("product", productSchema);

module.exports = { productModel };
