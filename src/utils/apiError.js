{
  /*
   * author: Md . Abib Ahmed Dipto
   * date : 05-09-2024
   * description : this is a apierror class file whenever a condition will be false and we  need to return a error response we're gonna use this class and make error reponse object  .
   * copyright : abib.web.dev@gmail.com
   */
}
// creatting class for sending apierror response
class apiError {
  constructor(
    status = 400 > 499,
    message = "not ok",
    Data = null,
    success = false
  ) {
    (this.status = status),
      (this.message = message),
      (this.Data = Data),
      (this.success = success);
  }
}
// exporting apierror class
module.exports = { apiError };
