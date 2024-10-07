{
  /*
   * author: Md . Abib Ahmed Dipto
   * date : 05-09-2024
   * description : this is the schema or model file for the user . it will define how user data will stay on mongoddb database   .
   * copyright : abib.web.dev@gmail.com
   */
}

// dependencies

// external dependencies
const mongoose = require("mongoose");
const { Schema } = mongoose;
const { model, models } = mongoose;

// regex pattern
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(?:\+8801|01)[3-9]\d{8}$/;

// user schema object
const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required!"],
      trim: true,
      maxlength: [15, "First Name max length is 15 characters"],
      minlength: [3, "First Name min length is 3 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required!"],
      trim: true,
      maxlength: [15, "Last Name max length is 15 characters"],
      minlength: [3, "Last Name min length is 3 characters"],
    },
    emailAddress: {
      type: String,
      required: [true, "Email Address is required"],
      trim: true,
      match: [emailRegex, "Please enter a valid email address"],
    },
    telephone: {
      type: String,
      required: [true, "Telephone number is required"],
      match: [phoneRegex, "Please enter a valid Bangladeshi phone number"],
    },
    permanentAddress: {
      type: String,
      required: [true, "Permanent Address is required"],
      trim: true,
    },
    presentAddress: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    postCode: {
      type: String,
      validate: {
        validator: function (v) {
          return v.length === 4;
        },
        message: "Invalid Post Code, it must be 4 characters long",
      },
    },
    division: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      min: [true, "Password must be at least 8 character"],
      max: [true, "Password can't be more than 32 character"],
      trim: true,
    },
    otp: {
      type: Number,
    },
    resetOtp: {
      type: Number,
    },
    role: {
      type: String,
      enum: ["admin", "user", "merchant"],
      default: "user",
    },
    refreshToken: {
      type: String,
    },
    avatar: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default:false
    },
  },
  {
    timestamps: true,
  }
);

// crating a user model
const user = models.user || model("user", UserSchema);

// exporting user . that's  meand the whole user schema object
module.exports = { user };
