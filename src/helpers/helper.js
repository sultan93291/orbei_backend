/*
 * author: Md. Abib Ahmed Dipto
 * date: 05-09-2024
 * description: This file is the helper file for the whole express app; it will create access tokens, encrypt passwords, decode passwords, etc.
 * copyright: abib.web.dev@gmail.com
 */

// Dependencies
// External dependencies
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

/**
 * Generates an access token for the given email address.
 * @param {string} emailAddress - The email address of the user.
 * @returns {string} The generated JWT access token.
 */

// password hashing function
const hashedPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (error) {
    console.log(error.message);
  }
};

// password decoding function
const decodePassword = async (password, hashedPassword) => {
  const passwordResult = await bcrypt.compare(password, hashedPassword);

  return passwordResult;
};

// token genearate function
const generateAccessToken = (emailAddress) => {
  try {
    const accessToken = jwt.sign(
      {
        emailAddress,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: process.env.EXPIRES_IN, // e.g., '1h'
      }
    );

    return accessToken;
  } catch (error) {
    console.error("Error generating access token:", error);
  }
};

module.exports = { generateAccessToken, hashedPassword, decodePassword };
