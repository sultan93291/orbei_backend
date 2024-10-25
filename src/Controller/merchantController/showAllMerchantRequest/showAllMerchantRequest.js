/*
 * Author: Md. Abib Ahmed Dipto
 * Date: 25-10-2024
 * Description: Handles the retrieval of all pending merchant requests. This function checks if the request is from an admin, then fetches and returns all unverified merchant entries. If no merchants or requests are found, it provides appropriate responses.
 */

// Dependencies

// External dependencies

// Internal dependencies
const { decodeToken } = require("../../../helpers/helper"); // Token decoding utility
const { merchantModel } = require("../../../Schema/MerchantSchema"); // Merchant schema/model
const { apiError } = require("../../../utils/apiError"); // Custom error handling utility
const { apiSuccess } = require("../../../utils/apiSuccess"); // Custom success handling utility
const { asyncHandler } = require("../../../utils/asyncaHandler"); // Asynchronous error handling wrapper

// Function to show all pending merchant requests
const showAllMerchantRequests = asyncHandler(async (req, res, next) => {
  // Decode token to retrieve user data from cookies
  const DecodedData = await decodeToken(req);

  // Check if the request is coming from an admin
  if (DecodedData?.Data?.userRole !== "admin") {
    return next(
      new apiError(401, "Only an admin can view merchant requests", null, false)
    );
  }

  // Fetch all merchant entries from the database
  const allMerchants = await merchantModel.find();

  // If no merchants are found in the database
  if (allMerchants.length === 0) {
    return next(new apiError(404, "No merchants found", null, false));
  }

  // Array to store unverified merchant requests
  const unverifiedMerchantRequests = [];

  // Filter for unverified merchants only
  allMerchants.forEach((merchant) => {
    if (!merchant.isVerifiedMerchant) {
      unverifiedMerchantRequests.push(merchant);
    }
  });

  // If there are no unverified merchant requests
  if (unverifiedMerchantRequests.length === 0) {
    return res.status(200).json(
      new apiSuccess(
        true,
        "Currently, there are no pending merchant requests.",
        200,
        null
      )
    );
  }

  // Return success response with all unverified merchant requests
  return res
    .status(200)
    .json(
      new apiSuccess(
        true,
        "All pending merchant requests",
        200,
        unverifiedMerchantRequests,
        false
      )
    );
});

module.exports = { showAllMerchantRequests };
