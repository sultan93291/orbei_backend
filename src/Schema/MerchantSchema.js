/*
 * author: Md. Abib Ahmed Dipto
 * date: 23-10-2024
 * description: This is the schema or model file for the merchant. It defines how merchant data will be stored in the MongoDB database, including their associated categories, subcategories, and verification status.
 * copyright: abib.web.dev@gmail.com
 */

// Dependencies

// External dependencies
const mongoose = require("mongoose");
const { Schema, model, models } = mongoose;

// Merchant schema definition
const merchantSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email address is required"],
      trim: true,
    },
    phone: {
      type: String,
      unique: true,
      required: [true, "Phone address is required"],
      trim: true,
    },
    userName: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
    },
    category: [
      {
        type: Schema.Types.ObjectId,
        ref: "category",
        required: [true, "Category is required"],
      },
    ],
    subcategory: [
      {
        type: Schema.Types.ObjectId,
        ref: "sub_category",
        required: [true, "Sub category is required"],
      },
    ],
    isVerifiedMerchant: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Check if model exists or create a new one
const merchantModel = models.merchant || model("merchant", merchantSchema);
module.exports = { merchantModel };
