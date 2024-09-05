{
  /*
   * author: Md . Abib Ahmed Dipto
   * date : 28-08-2024
   * description : this is the route handler file . it's gonna handle all the routes . and  after getting the route request it will give the route to the main app .
   * copyright : abib.web.dev@gmail.com
   */
}

// dependencies

// external dependencies
const express = require("express");
const router = express.Router();

// internal dependencies
const { CreateUser} =  require("../Routes/CreateUser/CreateUser.js")

//  demo route
router.get("/", (req, res) => {
  res.send("router is working");
});



// create user 
router.post(`/${process.env.VERSION_NAME}/create-user`, CreateUser);

// exporting the router . to use the router on app
module.exports = router;
