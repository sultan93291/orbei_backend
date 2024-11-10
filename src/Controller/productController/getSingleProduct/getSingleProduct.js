/**
 * @fileoverview This module handles fetching a single product from the database,
 * populates related fields such as category, subcategory, and owner,
 * and caches the result for better performance on subsequent requests.
 * @module getSingleProduct
 * @requires productModel
 * @requires apiError
 * @requires apiSuccess
 * @requires asyncHandler
 * @requires NodeCache
 * @version 1.0.0
 * @date 2024-11-09
 * @author Md. Abib Ahmed Dipto
 * @contact abib.web.dev@gmail.com
 */

// Importing necessary modules
const { productModel } = require("../../../Schema/productSchema"); // Product model
const { apiError } = require("../../../utils/apiError"); // API error utility
const { apiSuccess } = require("../../../utils/apiSuccess"); // API success utility
const { asyncHandler } = require("../../../utils/asyncaHandler"); // Async handler for managing async functions
const NodeCache = require("node-cache"); // NodeCache for caching

const myCache = new NodeCache(); // Initialize a cache instance

/**
 * @function getSingleProduct
 * @description Fetches a single product from the database, populates associated category, subcategory,
 * owner, and merchant information, and caches the result for faster access on future requests.
 * @param {Object} req - Express request object containing route parameters
 * @param {Object} res - Express response object for sending back the product data
 * @param {Function} next - Express middleware next function for error handling
 * @returns {Promise<void>} Responds with the product data or an error message
 */
const getSingleProduct = asyncHandler(async (req, res, next) => {
  // Extract product ID from request parameters
  const { id } = req.params;

  // Check if the product is cached
  const isProductCache = myCache.get(`${id}-product-cache`);
  if (isProductCache) {
    // If cache exists, return the cached product data
    return res.status(200).json(
      new apiSuccess(
        true, // Success status
        "Single product", // Response message
        200, // HTTP status code
        JSON.parse(isProductCache), // Parsed cached data
        false // No pagination or additional info
      )
    );
  }

  // Fetch the product from the database with nested population
  const singleProduct = await productModel
    .findById(id) // Get a product by ID
    .populate({
      path: "category", // Populate the category field
      populate: { path: "subCategory", strictPopulate: false }, // Nested populate for subCategory
    })
    .populate({
      path: "owner", // Populate the owner field
      select: "-password -refreshToken -otp -resetOtp", // Exclude sensitive fields
    })
    .populate("merchantId"); // Populate the merchantId field

  // If product is not found, return an error response
  if (!singleProduct) {
    return next(new apiError(404, "Product not found", null, false)); // Return 404 API error
  }

  // Cache the fetched product for future requests
  myCache.set(`${id}-product-cache`, JSON.stringify(singleProduct));

  // Send a success response with the fetched product data
  return res.status(200).json(
    new apiSuccess(true, "Single product", 200, singleProduct, false) // Success response
  );
});

// Export the handler function for use in other parts of the application
module.exports = { getSingleProduct };
