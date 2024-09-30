import env from "@lib/env"
import { transporter } from "."
import type { Dayjs } from "dayjs"

function emailContent(emailComposeTz: Dayjs, link: string) {
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .email-container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .email-header {
        text-align: center;
        padding: 10px 0;
        border-bottom: 1px solid #e0e0e0;
      }
      .email-body {
        padding: 20px;
        text-align: center;
        line-height: 1.6;
        color: #333333;
      }
      .reset-button {
        background-color: #007bff;
        color: #ffffff;
        text-decoration: none;
        padding: 15px 30px;
        border-radius: 5px;
        display: inline-block;
        margin-top: 20px;
        font-size: 16px;
      }
      .reset-button:hover {
        background-color: #0056b3;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
        <h2>Password Reset Request</h2>
      </div>
      <div class="email-body">
        <p>Click the button below to reset your password:</p>
        <a href="${link}" class="reset-button">Reset Your Password</a>
        <p>This link will expire in 12 hours starts from ${emailComposeTz.format(
          "DD/MM/YYYY HH:mm:ss"
        )} (UTC).</p>
      </div>
    </div>
  </body>
</html>
`
  return htmlContent
}

export const sendForgotPwd = async (
  clientEmail: string,
  composerTz: Dayjs,
  token: string
) => {
  const link = `${env.ENVIRONMENT === "dev" ? "HTTP" : "HTTPS"}://${
    env.APP_DOMAIN
  }/reset-password/${token}`
  const content = emailContent(composerTz, link)
  await transporter.sendMail({
    from: `"${env.APP_NAME}" < ${env.APP_EMAIL!} >`, // sender address
    to: clientEmail,
    subject: "Reset your password", // Subject line
    html: content,
  })
}
