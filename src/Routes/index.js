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
const authRoutes = require("./Api/Auth.Api.js");
const passwordRoutes = require("./Api/Auth.Api.js");
const { apiError } = require("../utils/apiError.js");

// initialization of routes if valid routes then it's gonna porced to the routes . or else it's gonna send an error invlaid or not found routes
router.use(process.env.VERSION_NAME, authRoutes);
router.use(process.env.VERSION_NAME, passwordRoutes);
router.use(process.env.VERSION_NAME, (req, res) => {
  res
    .status(404)
    .json(new apiError( 404, "Api Routes InValid !!", false));
});

module.exports = router;
