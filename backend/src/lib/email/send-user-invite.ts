import env from "@lib/env"
import { transporter } from "."
import type { Dayjs } from "dayjs"

function emailContent(
  inviterName: string,
  emailComposeTz: Dayjs,
  link: string
) {
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    .email-container {
      font-family: Arial, sans-serif;
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
      background-color: #f4f4f4;
      border: 1px solid #dddddd;
    }
    .email-content {
      text-align: center;
    }
    .email-button {
      display: inline-block;
      padding: 15px 25px;
      font-size: 18px;
      color: white;
      background-color: #007BFF;
      text-decoration: none;
      border-radius: 5px;
      margin-top: 20px;
    }
    .email-button:hover {
      background-color: #0056b3;
    }
    .disclaimer {
      font-style: italic;
    }
  </style>
</head>
<body>

<div class="email-container">
  <div class="email-content">
    <h1>You're invited to ${env.APP_NAME} by ${inviterName}</h1>
    <p>Click the button below to get started with your registration.</p>
    <p class="disclaimer">This link is only available for 12 hours starting from ${emailComposeTz.format(
      "DD/MM/YYYY HH:mm:ss"
    )} (UTC). If your link expired, contact your administration to reset the registration form.</p>
    <a href="${link}" class="email-button">Register Here</a>
  </div>
</div>

</body>
</html>

`
  return htmlContent
}

export const sendUserInvite = async (
  clientEmail: string,
  inviterName: string,
  composerTz: Dayjs,
  token: string
) => {
  const link = `${
    env.ENVIRONMENT === "dev" ? "HTTP" : "HTTPS"
  }://${env.APP_DOMAIN!}/register-user/${token}`
  const content = emailContent(inviterName, composerTz, link)
  await transporter.sendMail({
    from: `"${env.APP_NAME}" < ${env.APP_EMAIL!} >`, // sender address
    to: clientEmail,
    subject: "New account registration link", // Subject line
    html: content,
  })
}
