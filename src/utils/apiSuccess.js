{
  /*
   * author: Md . Abib Ahmed Dipto
   * date : 05-09-2024
   * description : this is a apisuccess class file whenever a condition will be true and we  need to return a success response we're gonna use this class and make success reponse object  .
   * copyright : abib.web.dev@gmail.com
   */
}

// creatting class for sending apisuccess response
class apiSuccess {
  constructor(
    sucess = true,
    message = null,
    status = 200 < 299,
    Data = null,
    error = false
  ) {
    (this.succss = sucess),
      (this.message = message),
      (this.status = status),
      (this.Data = Data);
    this.error = error;
  }
}

// exporting apisuccess class
module.exports = { apiSuccess };
