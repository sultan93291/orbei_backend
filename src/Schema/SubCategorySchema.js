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
const subCategorySchema = new Schema(
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
    product: {
      type: Schema.Types.ObjectId,
      ref: "product",
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: [true, "Category is required"],
    },
  },
  { timestamps: true }
);

// Check if model exists or create a new one
const SubCategoryModel =
  models.sub_category || model("sub_category", subCategorySchema);

module.exports = { SubCategoryModel };
