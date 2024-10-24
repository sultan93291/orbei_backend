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
const { decodeToken, decodePassword } = require("../../../helpers/helper"); // Token decoding and password validation helpers
const { emailChecker, passwordChecker } = require("../../../utils/checker"); // Email and password validation utilities
const { user } = require("../../../Schema/UserSchema"); // User schema/model

// Function for handling merchant creation
const createMerchant = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email format
  if (!email || !emailChecker(email)) {
    return next(new apiError(400, "Invalid email signature", null, false));
  }

  // Validate password format
  if (!password || !passwordChecker(password)) {
    return next(new apiError(400, "Invalid password signature", null, false));
  }

  // Decode token to get user data from cookies
  const DecodedData = await decodeToken(req);

  // Check email mismatch
  if (email !== DecodedData?.Data?.email) {
    return next(new apiError(401, "Unauthorized: Email mismatch", null, false));
  }

  // Retrieve user details using userId
  const isExistedUser = await user.findById(DecodedData?.Data?.userId);
  if (!isExistedUser) {
    return next(new apiError(404, "User not found", null, false));
  }

  // Check if user is already a merchant
  const isExistedMerchant = await merchantModel.findOne({
    userId: isExistedUser._id,
  });

  // If user is already a merchant or has merchant role
  if (isExistedMerchant || DecodedData?.Data?.userRole === "merchant") {
    return next(new apiError(400, "You're already a merchant", null, false));
  }

  // If user is an admin, they cannot become a merchant
  if (DecodedData?.Data?.userRole === "admin") {
    return next(
      new apiError(
        400,
        "You're already an admin, no need to become a merchant",
        null,
        false
      )
    );
  }

  // Validate password
  const isValidPass = await decodePassword(password, isExistedUser?.password);
  if (!isValidPass) {
    return next(new apiError(400, "Invalid username or password", null, false));
  }

  // Check if user is verified
  if (DecodedData?.Data?.isVerified === false) {
    return next(
      new apiError(
        401,
        "Unauthorized: To become a merchant, you need to verify your user account",
        null,
        false
      )
    );
  }


  // Create a new merchant entry
  const newMerchant = new merchantModel({
    userId: isExistedUser._id,
    email: email,
    phone: DecodedData?.Data?.telephone,
    userName: DecodedData?.Data?.firstName,
  });

  // Save the new merchant
  const savedMerchant = await newMerchant.save();
  if (!savedMerchant) {
    return next(
      new apiError(
        500,
        "Can't process request now, try again later",
        null,
        false
      )
    );
  }

  // Return success response with cookie
  return res.status(200).json(
    new apiSuccess(
      true,
      {
        message:
          "Your merchant request has been submitted successfully. Please wait for admin approval.",
      },
      null,
      false
    )
  );
});

module.exports = { createMerchant };
