/*
 * author: Md. Abib Ahmed Dipto
 * date: 05-09-2024
 * description: This is the schema or model file for the user. It defines how user data will be stored in the MongoDB database.
 * copyright: abib.web.dev@gmail.com
 */

// Dependencies

// External dependencies
const mongoose = require("mongoose");
const { Schema } = mongoose;
const { model, models } = mongoose;

// Category schema definition
const categorySchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "product",
      },
    ],
    isActive: {
      type: Boolean,
      default: false,
    },
    subcategory: [
      {
        type: Schema.Types.ObjectId,
        ref: "sub_category",
        required: [true, "Sub category is required"],
      },
    ],
  },
  { timestamps: true }
);

// Check if model exists or create a new one
const CategoryModel = models.category || model("category", categorySchema);

module.exports = { CategoryModel };
