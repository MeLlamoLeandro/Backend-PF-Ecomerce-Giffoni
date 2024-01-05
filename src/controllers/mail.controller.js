import nodemailer from "nodemailer";
import config from "../config/config.js";
import { usersService } from "../services/index.js";
import { generateResetToken } from "../utils/jwt.js";

const port = config.port;

const transport = nodemailer.createTransport({
  service: config.emailHost,
  port: config.emailPort,
  auth: {
    user: config.emailUser,
    pass: config.emailPass,
  },
});

// send email desde Postman
/* export const mailController = async(req, res) => {
  const { email, subject, message, attachments } = req.body;

  transport
    .sendMail({
      from: config.emailFrom,
      to: email,
      subject: subject,
      html: `${message}`,
      attachments: attachments,
    })
    .then((info) => {
      //console.log(info);
      req.logger.info(info, "Email sent successfully");
      res.send({ status: "success", message: "Email sent successfully" });
    })
    .catch((error) => {
      //console.log(error);
      req.logger.error(error, "Error sending email");
      res.send({ status: "error", message: "Error sending email" });
    });
}; */

//send email interno
export const sendEmailFunction = async (
  email,
  subject,
  message,
  attachments
) => {
  transport.sendMail({
    from: config.emailFrom,
    to: email,
    subject: subject,
    html: `${message}`,
    attachments: attachments,
  });
};

export const mailResetController = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await usersService.getUserByEmail(email);
    if (!user)
      return res
        .status(401)
        .send({ status: "Error", message: "Invalid credentials" });

    //esta todo ok, generar token y enviar email
    let token = generateResetToken(user);
    //enviar email
    await sendEmailResetPassword(email, token);
    res.send({ status: "success", message: "Email sent successfully" });
  } catch (error) {
    req.logger.error(error.message);
  }
};


//send email reset password
export const sendEmailResetPassword = async (email, token) => {
  let link = `http://localhost:${port}/api/users/reset/${token}`;
  let message = `<h1>Reset Password</h1>
    <p>Click on the following link to reset your password</p>
    <a href="${link}">${link}</a>
    `;
  transport.sendMail({
    from: config.emailFrom,
    to: email,
    subject: "Reset Password - CoderBackend Ecommerce",
    html: `${message}`,
    attachments: [],
  });
};
