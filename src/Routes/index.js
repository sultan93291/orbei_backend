{
  /*
   * author: Md . Abib Ahmed Dipto
   * date : 28-08-2024
   * description : this is the route handler index file . it's gonna handle all the file came from auth api and then it's gonna deliver it to the main app file  .
   * copyright : abib.web.dev@gmail.com
   */
}

// dependencies

// external dependencies
const express = require("express");
const { Router } = express;
const router = Router();

// internal dependencies

//all route dependencies
const authRoutes = require("./Api/Auth.Api.js");
const passwordRoutes = require("./Api/Password.Api.js");
const categoryRoutes = require("./Api/Catergory.Api.js");
const subCategoryRoutes = require("./Api/SubCategory.Api.js")
const MerchantControllerRoutes = require("./Api/Merchant.Api.js");
const productControllerRoutes = require("./Api/Product.Api.js");

// Helper files
const { apiError } = require("../utils/apiError.js");
const { apiSuccess } = require("../utils/apiSuccess.js");


// initialization of routes if valid routes then it's gonna porced to the routes . or else it's gonna send an error invlaid or not found routes

// main get route

router.route(process.env.VERSION_NAME).get((req, res) => {
  return res.json(
    new apiSuccess(
      true,
      "Successfully initialized production app    ",
      200,
      null,
      false
    )
  );
});

router.use(process.env.VERSION_NAME, authRoutes);
router.use(process.env.VERSION_NAME, passwordRoutes);
router.use(process.env.VERSION_NAME, categoryRoutes);
router.use(process.env.VERSION_NAME, subCategoryRoutes);
router.use(process.env.VERSION_NAME, MerchantControllerRoutes);
router.use(process.env.VERSION_NAME, productControllerRoutes);
router.use(process.env.VERSION_NAME, (req, res) => {
  res.status(404).json(new apiError(404, "Api Routes InValid !!", false));
});

module.exports = router;
