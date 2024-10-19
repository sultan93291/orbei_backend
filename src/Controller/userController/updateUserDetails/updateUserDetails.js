/*
 * author: Md. Abib Ahmed Dipto
 * date: 07-10-2024
 * description: This file is the update user details file . This file gonna validate user and if the user is validate then it's gonna update the user details  .
 * copyright: abib.web.dev@gmail.com
 */

// Dependencies

// External dependencies

// Internal dependencies
const { decodeToken } = require("../../../helpers/helper");
const { user } = require("../../../Schema/UserSchema");
const { apiError } = require("../../../utils/apiError");
const { apiSuccess } = require("../../../utils/apiSuccess");
const { asyncHandler } = require("../../../utils/asyncaHandler");
const { emailChecker, numberChecker } = require("../../../utils/checker");

// update user details mechanism
const updateUserDetails = asyncHandler(async (req, res, next) => {
    // Extracting user data from req.body
    const {
      firstName,
      lastName,
      emailAddress,
      telephone,
      permanentAddress,
      presentAddress,
      city,
      postCode,
      division,
      district,
      avatar,
    } = req.body;

    if (!emailChecker(emailAddress)) {
      return next(new apiError(400, "Invalid email signature", null, false));
    }

    if (!numberChecker(telephone)) {
      return next(
        new apiError(400, "Invalid phone number signature", null, false)
      );
    }

    // get data form cookies
    const DecodedData = await decodeToken(req);

    // checking is user existed
    const isExistedUser = await user.findById(DecodedData?.Data?.userId);
    console.log(isExistedUser);

    if (!isExistedUser) {
      return next(new apiError(404, "User not found", null, false));
    }

    // updated user object

    const updatedUser = {
      firstName: firstName ?? isExistedUser.firstName, // Update if provided, else keep previous
      lastName: lastName ?? isExistedUser.lastName,
      emailAddress: emailAddress ?? isExistedUser.emailAddress,
      telephone: telephone ?? isExistedUser.telephone,
      permanentAddress: permanentAddress ?? isExistedUser.permanentAddress,
      presentAddress: presentAddress ?? isExistedUser.presentAddress,
      city: city ?? isExistedUser.city,
      postCode: postCode ?? isExistedUser.postCode,
      division: division ?? isExistedUser.division,
      district: district ?? isExistedUser.district,
      avatar: avatar ?? isExistedUser.avatar,
      // Keep sensitive fields unchanged
      password: isExistedUser.password,
      role: isExistedUser.role,
      refreshToken: isExistedUser.refreshToken,
      otp: isExistedUser.otp,
      resetOtp: isExistedUser.resetOtp,
      isVerified: isExistedUser.isVerified,
      isValidatedResetAuth: isExistedUser.isValidatedResetAuth,
    };

    await user.findOneAndUpdate(
      { _id: DecodedData?.Data?.userId },
      updatedUser,
      {
        new: true,
      }
    );

    return res
      .status(200)
      .json(
        new apiSuccess(true, "Succesfully updated user Details", 200, false)
      );
});

module.exports = { updateUserDetails };
