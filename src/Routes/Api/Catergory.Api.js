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
const { authguard } = require("../../middleware/authGuard");
const { createCategory } = require("../../Controller/categoryController/createCategoryController/crateCategoryController");
const { apiSuccess } = require("../../utils/apiSuccess");
const { getAllRegisteredCategory } = require("../../Controller/categoryController/getAllCategory/getAllCategory");



// Base route
router.route("/get-category-api").get((req, res) => {
  res
    .status(200)
    .json(
      new apiSuccess(
        true,
        "Successfully initialized category routes   ",
        200,
        null,
        false
      )
    );
});

router.route("/create-category").post(authguard, createCategory);
router.route("/get-all-category").get(authguard, getAllRegisteredCategory);

module.exports = router;
