import nodemailer from "nodemailer";

var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER!,
    pass: process.env.MAILTRAP_PWD!,
  },
});

function appendLinkToContent(link: string) {
  const htmlContent = `
<h3>This is your email verification link</h3>
<p style="color: rgb(239 68 68);">Do not share this link with anyone!</p>
`;
  const anchorTag = `<a href="${link}">Click here to redirect to the confirmation page</a>`;

  return htmlContent + anchorTag;
}

export const sendMail = async (clientEmail: string, token: string) => {
  const link = `${process.env.HTTP_SCHEME!}://${process.env.APP_DOMAIN!}/verify-email/${token}`;
  const content = appendLinkToContent(link);
  await transporter.sendMail({
    from: `"Authnz App 🔒" <${process.env.APP_EMAIL!}>`, // sender address
    to: clientEmail,
    subject: "Email Verification Code", // Subject line
    html: content,
  });
};
