/*
 * Author: Md. Abib Ahmed Dipto
 * Date: 01-11-2024
 * Description: Retrieves all verified merchants and returns them in the response. If no verified merchants are found, an appropriate message is provided.
 */

// Dependencies

// External dependencies

// Internal dependencies
const { decodeToken } = require("../../../helpers/helper"); // Token decoding utility
const { merchantModel } = require("../../../Schema/MerchantSchema"); // Merchant schema/model
const { apiError } = require("../../../utils/apiError"); // Custom error handling utility
const { apiSuccess } = require("../../../utils/apiSuccess"); // Custom success handling utility
const { asyncHandler } = require("../../../utils/asyncaHandler"); // Asynchronous error handling wrapper

// Function to show all verified merchant requests
const getAllVerifiedMerchants = asyncHandler(async (req, res, next) => {
  // Fetch all merchant entries from the database
  const allMerchants = await merchantModel.find();

  // If no merchants are found in the database
  if (allMerchants.length === 0) {
    return next(new apiError(404, "No merchants found", null, false));
  }

  // Filter for verified merchants only
  const verifiedMerchantRequests = allMerchants.filter(
    (merchant) => merchant.isVerifiedMerchant
  );

  // If there are no verified merchant requests
  if (verifiedMerchantRequests.length === 0) {
    return res
      .status(200)
      .json(
        new apiSuccess(
          true,
          "Currently, there are no verified merchants.",
          200,
          null
        )
      );
  }

  // Return success response with all verified merchant requests
  return res
    .status(200)
    .json(
      new apiSuccess(
        true,
        "All verified merchants",
        200,
        verifiedMerchantRequests,
        false
      )
    );
});

module.exports = { getAllVerifiedMerchants };
