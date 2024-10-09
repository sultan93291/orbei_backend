{
  /*
   * author: Md. Abib Ahmed Dipto
   * date: 28-08-2024
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
  createCategory,
} = require("../../Controller/categoryController/crateCategoryController");
const { authguard } = require("../../middleware/authGuard");

router.route("/create-category").post(authguard, createCategory);

module.exports = router;
