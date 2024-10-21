{
  /*
   * author: Md. Abib Ahmed Dipto
   * date: 21-10-2024
   * description: This is the route handler file for handling all sub category routes. It forwards route requests to corresponding controller functions.
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
  createSubCategory,
} = require("../../Controller/subCategoryController/createSubCategory/createSubCategory");
const {
  getAllRegisteredSubCategory,
} = require("../../Controller/subCategoryController/getAllSubCategory/getAllSubCategory");
const {
  getRegisteredSubCategory,
} = require("../../Controller/subCategoryController/getSingleSubCategory/getSingleSubCategory");
const {
  updateSubCategory,
} = require("../../Controller/subCategoryController/updateSubCategory/updateSubCategory");


// Helper files
const { apiSuccess } = require("../../utils/apiSuccess");
const { authguard } = require("../../middleware/authGuard");


// Base route
router.route("/get-sub-category-api").get((req, res) => {
  res
    .status(200)
    .json(
      new apiSuccess(
        true,
        "Successfully initialized sub category routes ",
        200,
        null,
        false
      )
    );
});

// All Category routes

// All POST routes
router.route("/create-sub-category/:id").post(authguard, createSubCategory);

// All PUT routes
router.route("/update-sub-category/:id").put(authguard,updateSubCategory );

// All GET routes
router
  .route("/get-all-sub-category/:id")
  .get(authguard, getAllRegisteredSubCategory);
router
  .route("/get-sub-category/:id")
  .get(authguard, getRegisteredSubCategory);

// All DELETE routes

module.exports = router;
