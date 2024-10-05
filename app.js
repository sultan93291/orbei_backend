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
const allRoutes = require("./src/Routes/index.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// initializing port
const port = process.env.PORT;

// initializing app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(cookieParser())

// passing all routes to the main app
app.use(allRoutes);

// calling database
ConnectDb();

// main error handler function
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    statusCode: statusCode,
    success: false,
    message: err.message,
    data: err.data || null,
  });
});

//  configuration of port
app.listen(process.env.PORT || 3000, () => {
  console.log(
    chalk.bgBlueBright(`listening on port http://localhost:${port || 3000}`)
  );
});
