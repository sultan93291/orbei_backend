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

const mailSender = async ({ name, emailAddress, otp }) => {
  // Create a transporter object using SMTP transport
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.HOST_MAIL,
        pass: process.env.HOST_MAIL_PASS,
      },
    });

    // Define the email options
    const mailOptions = {
      from: "abib.web.dev@gmail.com",
      to: `${emailAddress}`,
      subject: `Verify your account`,
      html: EmailTemplate(name, otp),
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    
    return info;
  } catch (error) {
    console.log(error.code);
  }
};

module.exports = { mailSender };
