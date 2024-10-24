/*
 * author: Md. Abib Ahmed Dipto
 * date: 04-10-2024
 * description: This file is the email sending func file this file will take user mail mail body sub etc then it will deliver it to the email templae and finally if everything is okay it's gonn deliver to the user  .
 * copyright: abib.web.dev@gmail.com
 */

// Dependencies

// External dependencies

const nodemailer = require("nodemailer");

// internal dependencies
const { EmailTemplate } = require("../helpers/EmailTemplate");
const {MerchantApprovalTemplate} = require("../helpers/verifiedMerchantEmailTemplate")

const mailSender = async ({
  name,
  emailAddress,
  otp = null,
  type = "verification",
}) => {
  try {
    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.HOST_MAIL,
        pass: process.env.HOST_MAIL_PASS,
      },
    });

    // Choose email template based on type
    let emailTemplate;
    let subject;

    if (type === "verification") {
      // Require OTP for verification emails
      if (!otp) throw new Error("OTP is required for verification emails.");
      emailTemplate = EmailTemplate(name, otp);
      subject = "Verify your account";
    } else if (type === "merchantApproval") {
      // No OTP needed for merchant approval emails
      emailTemplate = MerchantApprovalTemplate(name);
      subject = "Your merchant account has been approved!";
    } else {
      throw new Error("Invalid email type specified.");
    }

    // Define the email options
    const mailOptions = {
      from: "abib.web.dev@gmail.com",
      to: emailAddress,
      subject: subject,
      html: emailTemplate,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return null; // or rethrow error based on your error handling preference
  }
};

module.exports = { mailSender };
