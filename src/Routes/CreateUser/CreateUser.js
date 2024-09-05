{
  /*
   * author: Md . Abib Ahmed Dipto
   * date : 05-09-2024
   * description : this is the create user file . thi file take all required properties from user . and validate them if everything okay then then it will start hashing the password after hashing it will check is user already if existed it will return a error else it will crate a user and after it will return 200 ok status . mean that time if any error occured it will be a server side problem so the try catch the catch will catch the problem and it will return the error  .
   * copyright : abib.web.dev@gmail.com
   */
}

// dependencies

// external dependencies
const bcrypt = require("bcrypt");

// internal dependencies
const { user } = require("../../Schema/UserSchema.js");
const { apiError } = require("../../utils/apiError.js");
const { apiSuccess } = require("../../utils/apiSuccess.js");

// function for handling creating users functionality
const CreateUser = async (req, res) => {
  // regex for validating data
  const EmailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
  const TelePhoneRegex = /^(?:\+8801|01)[3-9]\d{8}$/;
  const PasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+])[A-Za-z\d@$!%*?&#+]{8,32}$/;

  try {
    //extracting user data from req.body
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
      otp,
      role,
      refreshToken,
      avatar,
    } = req.body;

    // validating all data if every thing is valid then they won't return anything . if anything invalid only then it will return error response object

    if (!firstName) {
      return res
        .status(400)
        .json(new apiError(400, "please enter first name", null, false));
    }
    if (!lastName) {
      return res
        .status(400)
        .json(new apiError(400, "please enter last name", null, false));
    }
    if (!EmailRegex.test(emailAddress)) {
      return res
        .status(400)
        .json(
          new apiError(400, "please enter a valid email address", null, false)
        );
    }
    if (!TelePhoneRegex.test(telephone)) {
      return res
        .status(400)
        .json(
          new apiError(400, "please enter a valid email adress", null, false)
        );
    }
    if (!permanentAddress) {
      return res
        .status(400)
        .json(
          new apiError(400, "please enter your  permanent adress", null, false)
        );
    }
    if (!city) {
      return res
        .status(400)
        .json(new apiError(400, "please enter your  city ", null, false));
    }
    if (!PasswordRegex.test(password)) {
      return res
        .status(400)
        .json(new apiError(400, "please enter a valid password", null, false));
    }

    // checking if user already exists
    const isExisted = await user.findOne({ emailAddress: emailAddress });

    // if user already exists the requested will be over here
    if (isExisted) {
      return res
        .status(400)
        .json(new apiError(400, "user already exists", null, false));
    }

    // generating salt and hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // creating a new user object
    const newUser = new user({
      firstName: firstName,
      lastName: lastName,
      emailAddress: emailAddress,
      telephone: telephone,
      permanentAddress: permanentAddress,
      password: hashedPassword,
      city: city,
    });

    // saving the user to database
    const savedUser = await newUser.save();

    // if successfully saved the user to database that's means user created successfully then it will return a success response
    if (savedUser) {
      return res
        .status(200)
        .json(
          new apiSuccess(
            true,
            "succesfully registerd user",
            200,
            savedUser,
            false
          )
        );
    }

  } catch (error) {

    // if something wrong happened during try operation catch except that it will return a server side problem response
    return res
      .status(500)
      .json(new apiError(500, "server side problem", error, false));
  }
};

// exporting create user to for using in router to handle create user requests
module.exports = { CreateUser };
