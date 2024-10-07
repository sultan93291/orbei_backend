{
  /*
   * author: Md. Abib Ahmed Dipto
   * date: 28-08-2024
   * description: This is the route handler file for handling all user-related routes. It forwards route requests to corresponding controller functions.
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
  CreateUser,
} = require("../../Controller/userController/createUser/creatUser.js");
const {
  loginUser,
} = require("../../Controller/userController/loginUser/loginUser.js");
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
  getAllRegisteredUser,
} = require("../../Controller/userController/getAllUser/getAllUser.js");
const {
  changeUserRole,
} = require("../../Controller/userController/changeUserRole/changeUserRole.js");
const {
  verifyUserAccount,
} = require("../../Controller/userController/verifyUser/verifyUser.js");
const {
  getResetPasswordOtp,
} = require("../../Controller/passwordController/getResetPassOtp/getResetPassOtp.js");
const {
  verifyResetPassOtp,
} = require("../../Controller/passwordController/verifyResetOtp/verifyResetOtp.js");
const {
  updateUserDetails,
} = require("../../Controller/userController/updateUserDetails/updateUserDetails.js");
const {
  deleteUserAccount,
} = require("../../Controller/userController/deleteUser/deleteUser.js");

// Helper files
const { apiSuccess } = require("../../utils/apiSuccess.js");
const { authguard } = require("../../middleware/authGuard.js");
const { resetAuthGuard } = require("../../middleware/resetAuthGuard.js");

// Base route
router.route("/get-api").get((req, res) => {
  res
    .status(200)
    .json(
      new apiSuccess(
        true,
        "Successfully initialized production app   ",
        200,
        null,
        false
      )
    );
});

// All user routes

// All POST routes
router.route("/create-user").post(CreateUser);
router.route("/login-user").post(loginUser);
router.route("/forgot-pass").post(forgotPassword);
router.route("/reset-pass").post(resetAuthGuard, resetPassword);

// All PUT routes
router.route("/verify-account").put(authguard, verifyUserAccount);
router.route("/change-pass").put(authguard, changePassword);
router.route("/change-user-role").put(authguard, changeUserRole);
router.route("/verify-reset-otp").put(resetAuthGuard, verifyResetPassOtp);
router.route("/update-user-details").put(authguard, updateUserDetails);

// All GET routes
router.route("/get-all-user").get(authguard, getAllRegisteredUser);
router.route("/get-reset-otp").get(getResetPasswordOtp);

// All DELETE routes
router.route("/delete-user-account").delete(authguard, deleteUserAccount);

module.exports = router;
