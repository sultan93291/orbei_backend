/*
 * author: Md. Abib Ahmed Dipto
 * date: 04-10-2024
 * description: This is the template file for the user otp auth it's gonna make the firstname and otp then it's gonna create a template then it's gonna return the template to mail sender.
 * copyright: abib.web.dev@gmail.com
 */

// dependencies

// external dependencies
// email template function
const EmailTemplate = (firstName, otp) => {
  return `
  <html lang="en">
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        h2 {
            color: #333333;
        }
        .otp {
            font-size: 28px;
            font-weight: bold;
            color: #4A90E2;
            margin: 20px 0;
            text-align: center;
            padding: 10px;
            border: 2px dashed #4A90E2;
            border-radius: 5px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: #ffffff;
            background-color: #4A90E2;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
            margin-top: 15px;
            transition: background-color 0.3s;
        }
        .button:hover {
            background-color: #357ABD;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #666666;
            text-align: center;
        }
    </style>
</head>
<body>

<div class="container">
    <h2>Hello ${firstName},</h2>
    <p>Thank you for your request. To proceed with your verification, please use the following One-Time Password (OTP):</p>

    <div class="otp">${otp}</div>

    <p>Please enter it on the verification page.</p>

    <a href="[Your Verification Link]" class="button">Verify Now</a>

    <p class="footer">If you did not request this OTP, please ignore this email.</p>
</div>

</body>
</html>
  `;
};

module.exports = { EmailTemplate };
