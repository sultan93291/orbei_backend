{
  /*
   * author: Md . Abib Ahmed Dipto
   * date : 28-08-2024
   * description : this is the main file for orbei backend      process . this file is going to handle all the files . and it gonna trigger all the events . 
   * copyright : abib.web.dev@gmail.com
  */
}

// dependencies

// external dependencies
const express = require("express");
const chalk = require("chalk")
require("dotenv").config();


// internal dependencies
const router = require("./src/RouteHandler/routeHandler.js");
const { ConnectDb } = require("./src/ConnectDb/ConnetDb.js");


// initializing app 
const app = express();
app.use(express.json());


// behalf of calling app.get('/', function) we're gonna call router.get('/',function) and the app is  gonna  use the router
app.use("/", router);

// calling database
ConnectDb();

//  configuration of port 
app.listen(process.env.PORT || 3000, () => {
  console.log(
    chalk.bgBlueBright(`listening on port http://localhost:${process.env.PORT}`)
  );
});
