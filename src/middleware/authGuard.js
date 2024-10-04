/*
 * author: Md. Abib Ahmed Dipto
 * date: 05-09-2024
 * description: This file is the authguard file . which user is logging that user has  access token or not . if token then it's a authentic user or else it's not a authentic user  .
 * copyright: abib.web.dev@gmail.com
 */

// Dependencies

// External dependencies
const jwt = require("jsonwebtoken");
// Internal dependencies
const { apiError } = require("../utils/apiError.js");
const { asyncHandler } = require("../utils/asyncaHandler.js");

// auth guard mechanism

const authguard = asyncHandler(async (req, res, next) => {
  try {
    const { cookie, authorization } = req.headers;
    const removeBearer = authorization?.split("Bearer")[1];
    const token = removeBearer?.split("@")[1];
    const cookiesToken = cookie?.split("=")[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.ACCCESS_TOKEN_SCCRECT);
      if (decoded) {
        next();
      }
    } else if (cookiesToken) {
      const decoded = jwt.verify(cookiesToken, process.env.SECRET_KEY);
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


module.exports= {authguard}