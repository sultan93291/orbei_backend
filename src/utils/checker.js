{
  /*
   * author: Md . Abib Ahmed Dipto
   * date : 04-10-2024
   * description : this is the checker file for the express app it's gonna check with regex pattern it's true or false then retun to the called function
   */
}

// email checker function
const emailChecker = (email = "abibdipto@gmail.com") => {
  const EmailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
  const testResult = EmailRegex.test(email);

  return testResult;
};

// password checker function
const passwordChecker = (password = "##demoQ121@@") => {
  const PasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+])[A-Za-z\d@$!%*?&#+]{8,32}$/;
  const testResult = PasswordRegex.test(password);

  return testResult;
};

// number checker function
const numberChecker = (number = "+8801707104399") => {
  const TelePhoneRegex = /^(?:\+8801|01)[3-9]\d{8}$/;
  const testResult = TelePhoneRegex.test(number);

  return testResult;
};

module.exports = { emailChecker, passwordChecker, numberChecker };
