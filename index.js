{
  /*
   * author: Md . Abib Ahmed Dipto
   * date : 28-08-2024
   * description : this is the main file for orbei backend      process . this file is going to handle all the files . and it gonna trigger all the events and it will gonna call the app fiel trigger all the events and file whenever it will triggered from any user or any admin .
   * copyright : abib.web.dev@gmail.com
   */
}

// dependencies

// external dependencies
require("dotenv").config();

// internal dependencies
const app = require("./app.js");
const { ConnectDb } = require("./src/ConnectDb/ConnetDb");


// calling database
ConnectDb();

