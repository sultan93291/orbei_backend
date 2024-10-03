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
const {CreateUser} = require("../../Controller/userController/createUser/creatUser.js")
const { apiSuccess } = require("../../utils/apiSuccess.js");

router.route("/get-api").get((req, res) => {
  res
    .status(200)
    .json(
      new apiSuccess(true, "successfully initialized app", 200, null, false)
    );
});
router.route("/create-user").post(CreateUser);

module.exports = router;
