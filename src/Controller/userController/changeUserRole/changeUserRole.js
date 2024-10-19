/*
 * author: Md. Abib Ahmed Dipto
 * date: 07-10-2024
 * description: This file is gonna validate a user after validating it's gonna change the user role  .
 * copyright: abib.web.dev@gmail.com
 */

// Dependencies

// External dependencies

// Internal dependencies
const {
  decodeToken,
  generateAccessToken,
} = require("../../../helpers/helper.js");
const { user } = require("../../../Schema/UserSchema.js");
const { apiError } = require("../../../utils/apiError.js");
const { apiSuccess } = require("../../../utils/apiSuccess.js");
const { asyncHandler } = require("../../../utils/asyncaHandler.js");

const options = {
  httpOnly: true,
  secure: true,
};

// change user role mechanism
const changeUserRole = asyncHandler(async (req, res, next) => {
  try {
    // Extract data from body (no need for await here)
    const { role } = req.body;

    // All user roles
    const allUserRoles = ["user", "merchant", "admin"];

    // Check if the role is provided and valid
    if (!role || !allUserRoles.includes(role)) {
      return next(
        new apiError(
          400,
          `Invalid role. Allowed roles are: ${allUserRoles.join(", ")}`,
          null,
          false
        )
      );
    }

    // Decode token data
    const data = await decodeToken(req);

    // Check if the user is valid
    const isValidUser = await user.findById(data?.Data?.userId);
    if (!isValidUser) {
      return next(new apiError(400, "No user registered", null, false));
    }

    // Check if the role is already assigned
    if (isValidUser.role === role) {
      return next(new apiError(400, `You are already a ${role}.`, null, false));
    }

    // Verify the account before role change
    if (!isValidUser?.isVerified) {
      return next(
        new apiError(
          400,
          `To become a ${role}, you need to verify your account.`,
          null,
          false
        )
      );
    }

    // Change the user role
    isValidUser.role = role;
    await isValidUser.save();

    // Prepare token data with the updated role
    const tokenData = {
      email: isValidUser.emailAddress,
      telephone: isValidUser.telephone,
      firstName: isValidUser.firstName,
      userId: isValidUser?._id,
      isVerified: isValidUser?.isVerified,
      userRole: isValidUser?.role,
    };

    // Generate access token
    const token = await generateAccessToken(tokenData);

    // Save the new token in the database
    isValidUser.refreshToken = token;
    await isValidUser.save();

    // Return success response with the new token
    return res
      .status(200)
      .cookie("access_token", token, options)
      .json(
        new apiSuccess(
          true,
          `Successfully changed role. Congratulations, you're now a ${role}.`,
          200,
          false
        )
      );
  } catch (error) {
    return next(
      new apiError(500, `Server side problem: ${error.message}`, null, false)
    );
  }
});
module.exports = { changeUserRole };
