{
  /*
   * author: Md . Abib Ahmed Dipto
   * date : 28-08-2024
   * description : this is the database connect file . this file will take database url and . if everything is okay then it will connect the database  .
   * copyright : abib.web.dev@gmail.com
   */
}

// dependencies

// external dependencies
const mongoose = require("mongoose");
const chalk = require("chalk");


// internal dependencies
const DB_Name = require("../Constant/Constant.js");

// by default the database is not connected . so it's false
let isConnected = false


// database connect function
const ConnectDb = async () => {
  try {
    if (isConnected) {
      console.log(chalk.bgYellowBright("Already connected"));
    }

    connection_string = await mongoose.connect(process.env.MONGO_URL, {
      dbName: DB_Name,
    });

    isConnected = true;
    console.log(chalk.bgGreenBright("Successfully connected to the database"));
    
  } catch (e) {
    console.log(chalk.bgRedBright(e));
  }
};


// exporting the whole database function
module.exports = { ConnectDb };
