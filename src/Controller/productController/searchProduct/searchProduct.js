/**
 * @fileoverview Search Product Endpoint
 * @module controllers/productController
 * @description Handles product search functionality by searching for products where both name and model exist within a single field.
 *
 * @requires ../../../Schema/productSchema - Mongoose schema for product model
 * @requires ../../../utils/apiError - Custom error handling utility
 * @requires ../../../utils/apiSuccess - Custom success response utility
 * @requires ../../../utils/asyncHandler - Utility for handling asynchronous operations and errors
 *
 * @version 1.0.0
 * @date 2024-11-13
 * @author Md. Abib Ahmed Dipto
 */

const { productModel } = require("../../../Schema/productSchema");
const { apiError } = require("../../../utils/apiError");
const { apiSuccess } = require("../../../utils/apiSuccess");
const { asyncHandler } = require("../../../utils/asyncaHandler");

/**
 * @function searchProduct
 * @description Searches for a product by name and optionally by model within the same database field.
 * If a product is found that matches the provided parameters, returns success; otherwise, returns a 404 error.
 *
 * @async
 * @param {Object} req - Express request object containing the query parameters `name` and optionally `model`.
 * @param {Object} res - Express response object for sending the JSON response.
 * @param {Function} next - Express next middleware function for error handling.
 *
 * @returns {JSON} JSON response indicating success or failure of the search operation.
 */
const searchProduct = asyncHandler(async (req, res, next) => {
  const { name, model } = req.query;

  // Construct a regex to match the name, optionally including the model if provided
  let searchRegex;
  if (model) {
    searchRegex = new RegExp(`${name}.*${model}|${model}.*${name}`, "i");
  } else {
    searchRegex = new RegExp(name, "i"); // Match name only if model is not provided
  }

  // Query the database for a product that matches the regex in the name field
  const isProduct = await productModel
    .findOne({ name: searchRegex })
    .populate(["category", "subCategory", "owner", "merchantId"]);

  // If product is not found, return a 404 error with a custom message
  if (!isProduct) {
    return next(new apiError(404, "Product not found", null, false));
  }

  // If product is found, return a success response with the product data
  return res
    .status(200)
    .json(
      new apiSuccess(
        true,
        `${name}${model ? ` ${model}` : ""} product exists`,
        200,
        isProduct,
        false
      )
    );
});

module.exports = { searchProduct };
