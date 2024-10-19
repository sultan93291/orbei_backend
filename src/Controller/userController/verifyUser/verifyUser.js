/*
 * author: Md. Abib Ahmed Dipto
 * date: 05-09-2024
 * description: This file will handle user verification . it gonna collect a otp from user if the otp matched then it's gonna verified the user else it's gonna give a bad request error .
 * copyright: abib.web.dev@gmail.com
 */

const { decodeToken } = require("../../../helpers/helper");
const { user } = require("../../../Schema/UserSchema");
const { apiError } = require("../../../utils/apiError");
const { apiSuccess } = require("../../../utils/apiSuccess");
const { asyncHandler } = require("../../../utils/asyncaHandler");

// Dependencies

// External dependencies

// Internal dependencies

// verify user account mechanism

const verifyUserAccount = asyncHandler(async (req, res, next) => {
    const { otp } = req.body;

    // decode token data
    const data = await decodeToken(req);

    if (!otp) {
      return next(
        new apiError(400, "Please provide your 4 digit otp", null, false)
      );
    }

    if (!data || !data?.Data?.userId) {
      return next(new apiError(400, "Invalid or expired token", null, false));
    }

    // check is valid user
    const isValidUser = await user.findById(data?.Data?.userId);

    if (!isValidUser) {
      return next(new apiError(404, "No user registered", null, false));
    }
    if (isValidUser?.otp !== otp) {
      return next(new apiError(400, "Otp not matched", null, false));
    }

    isValidUser.isVerified = true;
    isValidUser.otp = null;
    await isValidUser.save();

    return res
      .status(200)
      .json(new apiSuccess(true, "Your account is now verified", null, false));
});

module.exports = { verifyUserAccount };
