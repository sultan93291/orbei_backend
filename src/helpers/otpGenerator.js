/*
 * author: Md. Abib Ahmed Dipto
 * date: 04-10-2024
 * description: This file gonna make a unique otp every single time  and deliver it to the sendmail funct . so that email func send it to user and user can validate his account 
 * copyright: abib.web.dev@gmail.com
 */

// dependencies

// external dependencies
const aleaRNGFactory = require("number-generator/lib/aleaRNGFactory");

// otp generator function
const otpGenerator = () => {
  return aleaRNGFactory(new Date()).uInt32().toString().slice(0, 4);
}

module.exports= {otpGenerator}