{
  /*
   * author: Md . Abib Ahmed Dipto
   * date : 28-08-2024
   * description : this is the route handler file . it's gonna handle all the routes . and  after getting the route request it will give the route to the index file for the  routes folder .
   * copyright : abib.web.dev@gmail.com
   */
}

// dependencies

// external dependencies
const express = require("express");
const { Router } = express;
const router = Router();

//internal dependencies
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

const { apiSuccess } = require("../../utils/apiSuccess.js");
const { authguard } = require("../../middleware/authGuard.js");
const { resetAuthGuard } = require("../../middleware/resetAuthGuard.js");

router.route("/get-api").get((req, res) => {
  res
    .status(200)
    .json(
      new apiSuccess(
        true,
        "successfully initialized production app   ",
        200,
        null,
        false
      )
    );
});

router.route("/create-user").post(CreateUser);
router.route("/login-user").post(loginUser);
router.route("/verify-account").put(authguard, verifyUserAccount);
router.route("/forgot-pass").post(forgotPassword);
router.route("/reset-pass").post(resetAuthGuard, resetPassword);
router.route("/change-pass").put(authguard, changePassword);
router.route("/get-all-user").get(authguard, getAllRegisteredUser);
router.route("/change-user-role").put(authguard, changeUserRole);
router.route("/get-reset-otp").get(getResetPasswordOtp);
router.route("/verify-reset-otp").put(resetAuthGuard, verifyResetPassOtp);
router.route("/update-user-details").put(authguard, updateUserDetails);
router.route("/delete-user-account").delete(authguard, deleteUserAccount);

module.exports = router;
