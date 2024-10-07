/*
 * author: Md. Abib Ahmed Dipto
 * date: 07-10-2024
 * description: This file is the reset  authguard file . which user has forgot his password and but after forgotting pass requsted for a reset pass verifiy his indentity with rest otp . that  user can go ahead with this guard . if the user is authentic this auth guard will let the person go ahead else it will send a unauthorize access error  .
 * copyright: abib.web.dev@gmail.com
 */

// Dependencies

// External dependencies
const jwt = require("jsonwebtoken");
// Internal dependencies
const { apiError } = require("../utils/apiError.js");
const { asyncHandler } = require("../utils/asyncaHandler.js");

// auth guard mechanism

const resetAuthGuard = asyncHandler(async (req, res, next) => {
  try {
    const { cookie, authorization } = req.headers;
    const removeBearer = authorization?.split("Bearer")[1];
    const token = removeBearer?.split("@")[1];
    const cookiesToken = cookie
      ?.split("; ")
      .find((c) => c.startsWith("reset_token="))
      ?.split("=")[1];

    if (!token && !cookiesToken) {
      return next(
        new apiError(401, "Unauthorized. Invalid reset token.", null, false)
      );
    }
    
    if (token) {
      const decoded = jwt.verify(token, process.env.RESET_SECRET_KEY);
      if (decoded) {
        next();
      }
    } else if (cookiesToken) {
      const decoded = jwt.verify(cookiesToken, process.env.RESET_SECRET_KEY);
      if (decoded) {
        next();
      }
    }
  } catch (error) {
    return next(
      new apiError(500, "Server-side problem: " + error.message, null, false)
    );
  }
});

module.exports = { resetAuthGuard };
