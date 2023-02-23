import nodemailer from "nodemailer";
 ;
import { appConfig } from "../../../appConfig";
const moment = require("moment");

export default class Mailer {

    public static sendMail = (mailList: any, message: any, subject: any, template: any, attachments?: Array<{filename: string; content: Buffer}>) => {
        const transporter = nodemailer.createTransport(appConfig.smtp);
        const sendMailOptions: any = {
            from: appConfig.email.solutionec,
            to: mailList.join(),
            subject: subject,
            text: message,
            html: template,
        };
        if (attachments) sendMailOptions.attachments = attachments;
        return transporter.sendMail(sendMailOptions);
    };
 

}











