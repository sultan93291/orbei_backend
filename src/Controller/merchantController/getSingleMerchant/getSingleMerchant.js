/*
 * Author: Md. Abib Ahmed Dipto
 * Date: 25-10-2024
 * Description: Retrieves a specific verified merchant by user ID. If the merchant does not exist or is unverified, an appropriate response is provided.
 */

// Dependencies

// External dependencies

// Internal dependencies
const { decodeToken } = require("../../../helpers/helper"); // Token decoding utility
const { merchantModel } = require("../../../Schema/MerchantSchema"); // Merchant schema/model
const { apiError } = require("../../../utils/apiError"); // Custom error handling utility
const { apiSuccess } = require("../../../utils/apiSuccess"); // Custom success handling utility
const { asyncHandler } = require("../../../utils/asyncaHandler"); // Asynchronous error handling wrapper

// Function to show a specific verified merchant by user ID
const getSingleMerchant = asyncHandler(async (req, res, next) => {
  // Get userId from request parameters
  const { id } = req.params;

  // Fetch the merchant entry by userId
  const requestedMerchant = await merchantModel.findById(id);

  // If no merchant is found or the merchant is unverified
  if (!requestedMerchant) {
    return next(
      new apiError(404, "Requested Merchant doesn't exist", null, false)
    );
  }

  if (!requestedMerchant.isVerifiedMerchant) {
    return next(new apiError(404, "Merchant is unverified", null, false));
  }

  // Return success response with the verified merchant data
  return res
    .status(200)
    .json(
      new apiSuccess(
        true,
        "Requested Merchant found",
        200,
        requestedMerchant,
        false
      )
    );
});

module.exports = { getSingleMerchant };
