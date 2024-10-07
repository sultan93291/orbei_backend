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
const generateAccessToken = async (Data) => {
  try {
    const accessToken = await jwt.sign(
      {
        Data,
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

// decode token function

const decodeToken = async (req) => {
  try {
    // Extract headers
    const { cookie, authorization } = req.headers;

    // Extract token from Authorization header (if available)
    const removeBearer = authorization?.split("Bearer ")[1];
    const token = removeBearer?.split("@")[1];

    // Extract token from cookies (if available)
    const cookiesToken = cookie
      ?.split("; ")
      .find((c) => c.startsWith("access_token="))
      ?.split("=")[1];

    // Decode the token without verification
    if (token) {
      const decoded = jwt.verify(token, process.env.SECRET_KEY); // Decode token from Authorization header
      return decoded;
    } else if (cookiesToken) {
      const decoded = jwt.verify(token, process.env.SECRET_KEY); // Decode token from cookies
      return decoded;
    } else {
      return null; // No token provided
    }
  } catch (error) {
    console.log(error.message);
    return null
  }
};

module.exports = {
  generateAccessToken,
  hashedPassword,
  decodePassword,
  decodeToken,
};
