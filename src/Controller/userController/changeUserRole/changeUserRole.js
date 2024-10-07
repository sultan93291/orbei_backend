/*
 * author: Md. Abib Ahmed Dipto
 * date: 07-10-2024
 * description: This file is gonna validate a user after validating it's gonna change the user role  .
 * copyright: abib.web.dev@gmail.com
 */

// Dependencies

// External dependencies

// Internal dependencies
const { decodeToken } = require("../../../helpers/helper.js");
const { user } = require("../../../Schema/UserSchema.js");
const { apiError } = require("../../../utils/apiError.js");
const { apiSuccess } = require("../../../utils/apiSuccess.js");
const { asyncHandler } = require("../../../utils/asyncaHandler.js");

// change user role mechanism

const changeUserRole = asyncHandler(async (req, res, next) => {
  try {
    // extract data from body
    const { role } = await req.body;

    // all user roles

    const allUserRoles = ["user", "merchant", "admin"];

    if (!role) {
      return next(new apiError(400, "Please select a role", null, false));
    }

    // Check if the role is valid
    if (!allUserRoles.includes(role)) {
      return next(
        new apiError(
          400,
          `Invalid role. Allowed roles are: ${allUserRoles.join(", ")}`,
          null,
          false
        )
      );
    }

    // decode token data

    const data = await decodeToken(req);

    // check is valid user
    const isValidUser = await user.findById(data?.Data?.userId);
    if (!isValidUser) {
      return next(new apiError(400, "No user registered", null, false));
    }

    // change user role

    if (isValidUser.role === role) {
      return next(
        new apiError(400, ` you are already a ${role} `, null, false)
      );
    }

    isValidUser.role = role;
    await isValidUser.save();

    return res
      .status(200)
      .json(
        new apiSuccess(
          true,
          ` Successfully changed role . congartulations you're  now a ${role} `,
          200,
          false
        )
      );
  } catch (error) {
    return next(
      new apiError(500, " server side problem : " + error.message, null, false)
    );
  }
});

module.exports = { changeUserRole };
