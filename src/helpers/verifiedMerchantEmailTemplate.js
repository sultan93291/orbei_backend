/*
 * author: Md. Abib Ahmed Dipto
 * date: 24-10-2024
 * description: This is the template file for the merchant approval notification email. It includes the merchant's first name and provides a clear call to action. The design features rounded corners at the bottom of the email.
 * copyright: abib.web.dev@gmail.com
 */

// email template function
const MerchantApprovalTemplate = (firstName) => {
  return `
<html lang="en">
<head>
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background-color: #f4f7f6;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 650px;
            background-color: #ffffff;
            margin: 40px auto;
            padding: 0;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border: 1px solid #e0e0e0;
        }
        .header {
            background-color: #007BFF;
            color: #ffffff;
            padding: 40px 0;
            text-align: center;
            font-size: 28px;
            font-weight: bold;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
        }
        .header h1 {
            margin: 0;
            font-size: 32px;
            letter-spacing: 1px;
        }
        .content {
            padding: 40px;
            font-size: 16px;
            line-height: 1.8;
            color: #333;
        }
        .content p {
            margin: 0 0 24px;
        }
        .button {
            display: inline-block;
            padding: 15px 30px;
            font-size: 16px;
            color: #ffffff;
            background-color: #007BFF;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 20px;
            text-align: center;
            transition: background-color 0.3s ease;
        }
        .button:hover {
            background-color: #0056b3;
        }
        .footer {
            padding: 20px;
            font-size: 13px;
            color: #666;
            text-align: center;
            background-color: #f4f7f6;
        }
        .footer p {
            margin: 0;
            padding: 10px 0;
        }
        .footer a {
            color: #007BFF;
            text-decoration: none;
        }
        .highlight {
            color: #007BFF;
            font-weight: bold;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="header">
        <h1>Welcome to Orebi!</h1>
    </div>
    <div class="content">
        <p>Hi ${firstName},</p>
        <p>We are thrilled to inform you that your application to become a verified merchant on <span class="highlight">Orebi</span> has been successfully approved!</p>
        <p>As a verified merchant, you now have access to exclusive benefits like enhanced visibility, priority support, and specialized tools to help grow your business on our platform.</p>
        <p>To start exploring your new merchant dashboard, click the button below:</p>
        <a href="[Your Dashboard Link]" class="button">Access Your Dashboard</a>
        <p>We are excited to see your business thrive with Orebi, and we are always here to assist you with any questions or support you need.</p>
    </div>
    <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Orebi. All rights reserved.</p>
        <p>If you did not request this email, please <a href="#">contact us</a>.</p>
    </div>
</div>

</body>
</html>
`;
};

module.exports = { MerchantApprovalTemplate };
