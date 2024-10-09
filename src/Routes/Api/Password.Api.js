{
  /*
   * author: Md. Abib Ahmed Dipto
   * date: 09-10-2024
   * description: This is the route handler file for handling all password-related routes. It forwards route requests to corresponding controller functions.
   * copyright: abib.web.dev@gmail.com
   */
}

// Dependencies

// External dependencies
const express = require("express");
const { Router } = express;
const router = Router();

//Internal dependencies

// All  controllers

const {
  forgotPassword,
} = require("../../Controller/passwordController/ForgotPassword/forgotPassword.js");
const {
  resetPassword,
} = require("../../Controller/passwordController/resetPassword/resetPassword.js");
const {
  changePassword,
} = require("../../Controller/passwordController/changePassword/changePassword.js");
const {
  getResetPasswordOtp,
} = require("../../Controller/passwordController/getResetPassOtp/getResetPassOtp.js");
const {
  verifyResetPassOtp,
} = require("../../Controller/passwordController/verifyResetOtp/verifyResetOtp.js");


// Helper files
const { apiSuccess } = require("../../utils/apiSuccess.js");
const { authguard } = require("../../middleware/authGuard.js");
const { resetAuthGuard } = require("../../middleware/resetAuthGuard.js");

// Base route
router.route("/get-pass-api").get((req, res) => {
  res
    .status(200)
    .json(
      new apiSuccess(
        true,
        "Successfully initialized password routes   ",
        200,
        null,
        false
      )
    );
});
// All user routes

// All POST routes
router.route("/forgot-pass").post(forgotPassword);
router.route("/reset-pass").post(resetAuthGuard, resetPassword);

// All PUT routes
router.route("/change-pass").put(authguard, changePassword);
router.route("/verify-reset-otp").put(resetAuthGuard, verifyResetPassOtp);

// All GET routes
router.route("/get-reset-otp").get(getResetPasswordOtp);



module.exports = router;
