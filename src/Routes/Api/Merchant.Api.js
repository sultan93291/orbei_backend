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
  createMerchant,
} = require("../../Controller/merchantController/createMerchant/createMerchant");
const {
  approveMerchant,
} = require("../../Controller/merchantController/approveMerchantRequest/approveMerchantRequest");
const {
  showAllMerchantRequests,
} = require("../../Controller/merchantController/showAllMerchantRequest/showAllMerchantRequest");


// Helper files
const { apiSuccess } = require("../../utils/apiSuccess");
const { authguard } = require("../../middleware/authGuard");

// Base route
router.route("/get-merchant-api").get((req, res) => {
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
router.route("/create-merchant").post(authguard, createMerchant);

router.route("/approve-merchant/:id").post(authguard, approveMerchant);

// All PUT routes

// All GET routes
router.route("/merchant-requests").get(authguard, showAllMerchantRequests);

// All DELETE routes

module.exports = router;
