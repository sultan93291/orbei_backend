/*
 * Author: Md. Abib Ahmed Dipto
 * Date: 01-11-2024
 * Description: This is the route handler file for handling all product routes. It forwards route requests to corresponding controller functions.
 * Copyright: abib.web.dev@gmail.com
 */

// Dependencies

// External dependencies
const express = require("express");
const { Router } = express;
const router = Router();

// Internal dependencies

// All controllers
const {
  createProduct,
} = require("../../Controller/productController/createProduct/createProduct");
const {
  getAllProducts,
} = require("../../Controller/productController/getProduct/getProduct");
const {
  updateProduct,
} = require("../../Controller/productController/updateProduct/updateProduct");

// Helper files
const { apiSuccess } = require("../../utils/apiSuccess");
const { authguard } = require("../../middleware/authGuard");
const { uploadImages } = require("../../middleware/multer.middleware");
const { getSingleProduct } = require("../../Controller/productController/getSingleProduct/getSingleProduct");

// Base route
router.route("/get-product-api").get((req, res) => {
  res
    .status(200)
    .json(
      new apiSuccess(
        true,
        "Successfully initialized product routes",
        200,
        null,
        false
      )
    );
});

// All Product routes

// POST route for creating a product
router
  .route("/create-product")
  .post(
    authguard,
    uploadImages.fields([{ name: "image", maxCount: 10 }]),
    createProduct
  );

// PUT route for updating a product by ID
router
  .route("/update-product/:id")
  .put(authguard, uploadImages.fields([{ name: "image", maxCount: 10 }]), updateProduct);

// DELETE route for deleting a product by ID

// GET route for retrieving a single product by ID
router.route("/get-product/:id").get(authguard, getSingleProduct);

// GET route for retrieving all products
router.route("/get-all-products").get(authguard,getAllProducts);

module.exports = router;
