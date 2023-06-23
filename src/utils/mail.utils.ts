import config from "config";
import { createTransport } from "nodemailer";

export const mailer = createTransport({
     service: "gmail",
     auth: {
          user: config.get("MAIL_USER"),
          pass: config.get("MAIL_PASS"),
     },
});
