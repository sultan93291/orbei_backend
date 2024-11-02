/*
 * Author: Md. Abib Ahmed Dipto
 * Date: 24-10-2024
 * Description: Handles the creation of a new merchant. This function validates the incoming request data, checks for duplicate merchants, and if valid, saves the merchant details to the database. It returns a success response upon successful creation or an error message if the process fails at any step.
 */

// Dependencies

// External dependencies

// Internal dependencies
const { apiError } = require("../../../utils/apiError"); // Custom error handling utility
const { apiSuccess } = require("../../../utils/apiSuccess"); // Custom success handling utility
const { asyncHandler } = require("../../../utils/asyncaHandler"); // Asynchronous error handling wrapper
const { merchantModel } = require("../../../Schema/MerchantSchema"); // Merchant schema/model
const { user } = require("../../../Schema/UserSchema"); // User schema/model
const { mailSender } = require("../../../utils/sendMail");
const { decodeToken } = require("../../../helpers/helper");

// approve merchant  mechanism
// approve merchant mechanism
const approveMerchant = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Decode token to get user data from cookies
  const DecodedData = await decodeToken(req);

  // Verify if the requester has admin privileges
  if (DecodedData?.Data?.userRole !== "admin") {
    return next(
      new apiError(403, "Unauthorized. Admin access required.", null, false)
    );
  }

  if (!id) {
    // Check for provided merchant ID
    return next(new apiError(400, "Merchant ID is required.", null, false));
  }

  const isExistedMerchant = await merchantModel.findById(id);

  if (!isExistedMerchant) {
    return next(new apiError(404, "Merchant not found.", null, false));
  }

  if (isExistedMerchant.isVerifiedMerchant) {
    return next(
      new apiError(400, "Merchant is already verified.", null, false)
    );
  }

  // Update merchant status to verified
  isExistedMerchant.isVerifiedMerchant = true;
  await isExistedMerchant.save();

  // Update user's role to 'merchant'
  const isExistedUser = await user.findById(isExistedMerchant.userId);
  if (!isExistedUser) {
    return next(
      new apiError(404, "User not found for this merchant.", null, false)
    );
  }

  isExistedUser.role = "merchant";
  await isExistedUser.save();

  const mailInfo = await mailSender({
    name: isExistedUser.firstName,
    emailAddress: isExistedUser.emailAddress,
    type: "merchantApproval", // Specify the email type for merchant approval
  });

  if (!mailInfo) {
    return next(
      new apiError(
        500,
        "Can't send approval mail, try again later.",
        null,
        false
      )
    );
  }

  // Return success response
  return res.status(200).json(
    new apiSuccess(
      true,
      "Congratulations! The user is now a verified merchant.",
      200,
      { merchant: isExistedMerchant },
      false
    )
  );
});

module.exports = { approveMerchant };
