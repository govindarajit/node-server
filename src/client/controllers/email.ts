import { Request, Response } from "express";
import * as _ from "lodash";

import logger from "../../shared/util/logger";
import Mailer from "../../shared/lib/mailer/mailer";


export const sendEmail = (req: Request, res: Response) => {

    logger.debug("Mail intiated");

    // const buffer = Buffer.from(req.body.pdfFile.split(",")[1], 'base64');
    // fs.writeFileSync('data.pdf', buffer);

    const user: any = req.user;
    const mailList = ["shiva.kumar@solutionec.com","ShivaKumar.Mangina-ext@sanofi.com","Sreenadh.Ganapathy@solutionec.com","shiva2nani.mangina@gmail.com"];
    const message = "hello message";
    const subject = `Gapanalysis - ${req.body.fileName}`;
    const template = `
       <p> hello !! here is your graph.Email from node mailer</p>
    `;

    const attachment = [{   // binary buffer as an attachment
        filename: `${req.body.fileName}.pdf`,
        content: Buffer.from(req.body.pdfFile.split(",")[1], "base64")
    }];

    Mailer.sendMail(mailList, message, subject, template, attachment).then((response) => {
        res.send({response});
        logger.debug("Mail sent", response);
    }).catch((error) => {
        logger.debug(error);
    });

};






