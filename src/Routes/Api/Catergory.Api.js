{
  /*
   * author: Md. Abib Ahmed Dipto
   * date: 28-08-2024
   * description: This is the route handler file for handling all category routes. It forwards route requests to corresponding controller functions.
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
  getAllRegisteredCategory,
} = require("../../Controller/categoryController/getAllCategory/getAllCategory");
const {
  getSingleRegisteredCategory,
} = require("../../Controller/categoryController/getSingleCategory/getSingleCategory");
const {
  createCategory,
} = require("../../Controller/categoryController/createCategoryController/crateCategoryController");
const {
  updateCategory,
} = require("../../Controller/categoryController/updateCategory/updateCategory");
const {
  deleteCategory,
} = require("../../Controller/categoryController/deleteCategoryController/deleteCategory");
const {
  approveCategoryController,
} = require("../../Controller/categoryController/approveCategoryController/approveCategoryController");

// Helper files
const { apiSuccess } = require("../../utils/apiSuccess");
const { authguard } = require("../../middleware/authGuard");



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

// All Category routes

// All POST routes
router.route("/create-category").post(authguard, createCategory);

// All PUT routes
router.route("/update-category/:title").put(authguard, updateCategory);
router.route("/approve-category/:id").put(authguard, approveCategoryController);

// All GET routes
router.route("/get-all-category").get(authguard, getAllRegisteredCategory);
router
  .route("/get-single-category/:title")
  .get(authguard, getSingleRegisteredCategory);

// All DELETE routes
router.route("/delete-category/:title").delete(authguard, deleteCategory);

module.exports = router;
