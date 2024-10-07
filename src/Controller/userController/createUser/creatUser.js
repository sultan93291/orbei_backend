/*
 * author: Md. Abib Ahmed Dipto
 * date: 05-09-2024
 * description: This file handles the creation of a new user. It takes all required properties from the request body, validates them, and if everything is valid, it hashes the password. It then checks if the user already exists; if so, it returns an error; otherwise, it creates a new user and responds with a 200 OK status. If any errors occur during this process, a server-side error response will be returned.
 * copyright: abib.web.dev@gmail.com
 */

// Dependencies

// External dependencies

// Internal dependencies
const { user } = require("../../../Schema/UserSchema.js");
const { apiError } = require("../../../utils/apiError.js");
const { apiSuccess } = require("../../../utils/apiSuccess.js");
const { asyncHandler } = require("../../../utils/asyncaHandler.js");
const { mailSender } = require("../../../utils/sendMail.js");
const { otpGenerator } = require("../../../helpers/otpGenerator.js");

const {
  emailChecker,
  passwordChecker,
  numberChecker,
} = require("../../../utils/checker.js");
const {
  hashedPassword,
  generateAccessToken,
} = require("../../../helpers/helper.js");

const options = {
  httpOnly: true,
  secure: true,
};

// Function for handling user creation
const CreateUser = asyncHandler(async (req, res, next) => {
  try {
    // Extracting user data from req.body
    const {
      firstName,
      lastName,
      emailAddress,
      telephone,
      permanentAddress,
      presentAddress,
      city,
      postCode,
      division,
      district,
      password,
      avatar,
    } = req.body;

    // Validating all data
    if (!firstName) {
      return next(new apiError(400, "Please enter first name", null, false));
    }
    if (!lastName) {
      return next(new apiError(400, "Please enter last name", null, false));
    }
    if (!emailChecker(emailAddress)) {
      return next(
        new apiError(400, "Please enter a valid email address", null, false)
      );
    }
    if (!numberChecker(telephone)) {
      return next(new apiError(400, "Please enter a valid telephone number"));
    }
    if (!permanentAddress) {
      return next(
        new apiError(400, "Please enter your permanent address", null, false)
      );
    }
    if (!city) {
      return next(new apiError(400, "Please enter your city", null, false));
    }
    if (!passwordChecker(password)) {
      return next(
        new apiError(400, "Please enter a valid password", null, false)
      );
    }

    // Checking if user already exists
    const isExisted = await user.findOne({ emailAddress });

    if (isExisted) {
      return next(new apiError(400, "User already exists", null, false));
    }

    // calling password hashing function
    const hashedPass = await hashedPassword(password);

    // Creating a new user object
    const newUser = new user({
      firstName,
      lastName,
      emailAddress,
      telephone,
      permanentAddress,
      password: hashedPass,
      city,
    });

    // Saving the user to the database
    const savedUser = await newUser.save();
    // generate otp
    const Otp = await otpGenerator();
    console.log(Otp);

    const data = {
      firstName,
      emailAddress,
      telephone,
      userId: savedUser?._id,
      isVerified:savedUser?.isVerified
    };

    
    // call the the mail sender fucntion
    const mailInfo = await mailSender({
      name: firstName,
      emailAddress,
      otp: Otp,
    });

    // generate token
    const token = await generateAccessToken(data);

    if (savedUser || token || mailInfo) {
      // now set the opt
      await user.findOneAndUpdate(
        {
          _id: savedUser._id,
        },
        {
          $set: { otp: Otp, refreshToken: token },
        },
        {
          new: true,
        }
      );

      // filter out the hashed password from response object

      const registeredUser = await user
        .find({ $or: [{ emailAddress }] })
        .select("-password");

      // If successfull return a success response
      return res
        .status(200)
        .cookie("access_token", token, options)
        .json(
          new apiSuccess(
            true,
            "Successfully registered user",
            200,
            registeredUser,
            false
          )
        );
    }
  } catch (error) {
    // Forwarding any unexpected errors to the error-handling middleware
    return next(
      new apiError(500, "Server-side problem: " + error.message, null, false)
    );
  }
});

// Exporting CreateUser function for routing
module.exports = { CreateUser };
