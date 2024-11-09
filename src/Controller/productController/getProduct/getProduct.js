/**
 * @fileoverview This module handles fetching all products from the database,
 * populates related fields like category, subcategory, and owner,
 * and caches the results for better performance.
 * @author Md. Abib Ahmed Dipto
 * @date 2024-11-09
 * @copyright © abib.web.dev@gmail.com
 */

// Importing necessary modules
const { productModel } = require("../../../Schema/productSchema"); // Import the product model from the schema
const { apiError } = require("../../../utils/apiError"); // Import API error utility
const { apiSuccess } = require("../../../utils/apiSuccess"); // Import API success utility
const { asyncHandler } = require("../../../utils/asyncaHandler"); // Import async handler for managing async functions
const NodeCache = require("node-cache"); // Import NodeCache for caching
const myCache = new NodeCache(); // Initialize a new cache instance

/**
 * @function getAllProducts
 * @description This function handles fetching all products from the database,
 * populates the associated category, subcategory, and owner information,
 * and caches the result for subsequent requests to improve performance.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Promise<void>} Sends a response with the products data or an error message
 */
const getAllProducts = asyncHandler(async (req, res, next) => {
  // Check if there is already a cached version of all products
  let isProductCache = myCache.get("allProducts");
  if (isProductCache) {
    // If cache exists, return the cached products data
    return res.status(200).json(
      new apiSuccess(
        true, // Success status
        "all products", // Message for the response
        200, // HTTP status code
        JSON.parse(isProductCache), // Parse the cached data
        false // No pagination or additional info
      )
    );
  }

  // Query to fetch all products from the database with nested population
  const allProducts = await productModel
    .find({}) // Get all products
    .populate({
      path: "category", // Populate the category field of each product
      populate: { path: "subCategory", strictPopulate: false }, // Nested populate for subCategory under category; setting strictPopulate to false to allow optional subCategory
    })
    .populate({
      path: "owner", // Populate the owner field, excluding sensitive fields
      select: "-password -refreshToken -otp -resetOtp", // Exclude sensitive fields from the owner document
    })
    .populate("merchantId"); // Populate the merchantId field

  // If no products were found, return an error response
  if (allProducts.length < 1) {
    return next(new apiError(500, "no products found", null, false)); // Return API error
  }

  // Cache the fetched products for future use to improve performance
  myCache.set("allProducts", JSON.stringify(allProducts));

  // Return the products data in a successful response
  return res
    .status(200)
    .json(new apiSuccess(true, "all products", 200, allProducts, false)); // Return API success response with the fetched products
});

// Export the handler function for use in other parts of the application
module.exports = { getAllProducts };
