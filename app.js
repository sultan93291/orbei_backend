{
  /*
   * author: Md . Abib Ahmed Dipto
   * date : 28-08-2024
   * description : this is the main file for orbei backend      process . this file is going to handle all the files . and it gonna trigger all the events and it will be the main helper file for the index file .
   * copyright : abib.web.dev@gmail.com
   */
}


// external dependencies
const express = require("express");
const chalk = require("chalk");
require("dotenv").config();

// internal dependencies
const { ConnectDb } = require("./src/ConnectDb/ConnetDb.js");
const allRoutes = require("./src/Routes/index.js")

// initializing port 
const port = process.env.PORT

// initializing app
const app = express();
app.use(express.json());

// behalf of calling app.get('/', function) we're gonna call router.get('/',function) and the app is  gonna  use the router
app.use(allRoutes);

// calling database
ConnectDb();

//  configuration of port
app.listen(process.env.PORT || 3000, () => {
  console.log(
    chalk.bgBlueBright(
      `listening on port http://localhost:${port || 3000}`
    )
  );
});
