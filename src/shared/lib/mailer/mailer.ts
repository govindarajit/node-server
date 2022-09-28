import nodemailer from "nodemailer";
import { DataLoadSetting } from "../../../shared/models/DataLoadSetting";
import { FileUpload } from "../../../shared/models/FileUpload";
import { User } from "../../../shared/models/User";
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

    public static dailyMail = () => {
        let homeData: any = [];
        return DataLoadSetting.find()
            .populate("countryId").lean()
            .then((dataloadSettings: any) => {
                homeData = dataloadSettings;
                return Promise.all(dataloadSettings.map((dataloadSetting: any, index: number) => {
                    return FileUpload.findOne({ "dataLoadSetting": dataloadSetting._id })
                        .sort({ "fileDate": -1 })
                        .limit(1).lean();
                }));
            }).then((response: any) => {
                return response.map((item: any, index: number) => {
                    return { ...homeData[index], latestFileDate: item };
                });
            }).then((response) => {
                response.map((item: any) => {
                    let delayed = 0;
                    if (item.fileExpectedDate && item.latestFileDate) {
                        const duration: any = moment.duration(moment(item.fileExpectedDate).diff(moment(item.latestFileDate.fileDate)));
                        if (duration._milliseconds > 0) {
                            delayed = 1;  // delayed
                            User.find({ "countries": item.countryId._id, "isDeleted": false }).then((emails) => {
                                const mailList = emails.map(item => item.email);
                                const message = "Dear Data steward,We have not received the file of March 2020";
                                const subject = "File Not received";
                                const template = "<p>Dear Data steward,We have not received the file of March 2020</p>";

                                Mailer.sendMail(mailList, message, subject, template).then((response) => {
                                    console.log(response);
                                }).catch((error) => {
                                    console.log(error);
                                });
                            }
                            );

                        } else {
                            delayed = -1; // on track
                        }
                    }
                });
            }
            );
    }

}











