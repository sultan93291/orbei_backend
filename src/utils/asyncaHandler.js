{
  /*
   * author: Md . Abib Ahmed Dipto
   * date : 05-09-2024
   * description : this is a asynce hanlder file . it will controll all asynce file and functions so that we don't need to implement try catch block in all files   .
   * copyright : abib.web.dev@gmail.com
   */
}

// dependencies

// internal dependencies 
const { apiError } = require("./apiError");

// async handler function
const asyncHandler = (fun = () => {}) => {
  return async (req, res, next) => {
    try {
      await fun(req, res, next);
    } catch (error) {
      next(
        new apiError(false, null, 500, "Async Handeler Error: " + error.message)
      );
    }
  };
};


// exprting async handler function
module.exports = { asyncHandler };
