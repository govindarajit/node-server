import { Request, Response } from "express";
import path from "path";
const fs = require("fs");
const XLSX = require("xlsx");
import { ChcAlignment } from "./../../shared/models/ChcAlignment";
import { ChangeRequest } from "./../../shared/models/ChangeRequest";
import Mailer from "../../shared/lib/mailer/mailer";
/**
 * Uploads files
 * @param {e.Request} req
 * @param {e.Response} res
 */
export const addChcAlignment = (req: Request, res: Response) => {

    const buf = fs.readFileSync(path.resolve(__dirname, "../../../uploads/chc-alignment/chc-alignment.xlsx"));
    const book = XLSX.read(buf, { type: "buffer" });
    const sheetNameList = book.SheetNames;
    const data = XLSX.utils.sheet_to_json(book.Sheets[sheetNameList[0]]);
    const mapKeys = data[0];
    const resultKeys = {};
    const chcMarketDefinitions = [];
    const tempMegaCategory: any = {};
    let prevMegaCategory = "Allergy";
    let prevCategory = "Anti-Allergy Oral";

    for (let index = 0; index < data.length; index++) {
        const chcBusinesDoc: any = {};
        const row = data[index];
        let tmega = false, tcategory = false;

        //Checking the MegaCategory and Category
        Object.keys(row).forEach(key2 => {
            if (key2 == "__EMPTY") {
                tmega = true;
            }
            if (key2 == "__EMPTY_1") {
                tcategory = true;
            }

        });
        if (tmega == false) {
            chcBusinesDoc.megaCategory = prevMegaCategory;
        }
        if (tcategory == false) {
            chcBusinesDoc.category = prevCategory;
        }
        if (index > 1) {
            const keys = Object.keys(row);

            let tempChcBusinesDoc: any = {};

            for (let i = 0, len = keys.length; i < len; i++) {
                const rowKey = keys[i];

                if (mapKeys[rowKey] === "Mega Categories") {
                    chcBusinesDoc.megaCategory = row[rowKey];
                    prevMegaCategory = row[rowKey];
                }

                if (mapKeys[rowKey] === "Category") {
                    chcBusinesDoc.category = row[rowKey];
                    prevCategory = row[rowKey];
                }
                if (mapKeys[rowKey] === "ATC4 Decription") {
                    chcBusinesDoc.atc4Description = row[rowKey];
                }

                if (mapKeys[rowKey] === "ATC4") {
                    chcBusinesDoc.atc4 = row[rowKey];
                }

                if (mapKeys[rowKey] === "Argentina") {
                    tempChcBusinesDoc.country = mapKeys[rowKey];
                    tempChcBusinesDoc.rx = Math.round(100 * row.__EMPTY_4).toString();
                    tempChcBusinesDoc.otc = Math.round(100 * row.__EMPTY_5).toString();
                    tempChcBusinesDoc.includeRx = row.__EMPTY_6;
                    Object.assign(tempChcBusinesDoc, chcBusinesDoc);
                    chcMarketDefinitions.push(tempChcBusinesDoc);
                    tempChcBusinesDoc = {};
                }
                if (mapKeys[rowKey] === "Brazil") {
                    tempChcBusinesDoc.country = mapKeys[rowKey];
                    tempChcBusinesDoc.rx = Math.round(100 * row.__EMPTY_7).toString();
                    tempChcBusinesDoc.otc = Math.round(100 * row.__EMPTY_8).toString();
                    tempChcBusinesDoc.includeRx = row.__EMPTY_9;
                    Object.assign(tempChcBusinesDoc, chcBusinesDoc);
                    chcMarketDefinitions.push(tempChcBusinesDoc);
                    tempChcBusinesDoc = {};

                }
                if (mapKeys[rowKey] === "Colombia") {
                    tempChcBusinesDoc.country = mapKeys[rowKey];
                    tempChcBusinesDoc.rx = Math.round(100 * row.__EMPTY_10).toString();
                    tempChcBusinesDoc.otc = Math.round(100 * row.__EMPTY_11).toString();
                    tempChcBusinesDoc.includeRx = row.__EMPTY_12;
                    Object.assign(tempChcBusinesDoc, chcBusinesDoc);
                    chcMarketDefinitions.push(tempChcBusinesDoc);
                    tempChcBusinesDoc = {};
                }
                if (mapKeys[rowKey] === "Mexico") {
                    tempChcBusinesDoc.country = mapKeys[rowKey];
                    tempChcBusinesDoc.rx = Math.round(100 * row.__EMPTY_13).toString();
                    tempChcBusinesDoc.otc = Math.round(100 * row.__EMPTY_14).toString();
                    tempChcBusinesDoc.unknown = Math.round(100 * row.__EMPTY_15).toString();
                    tempChcBusinesDoc.includeRx = row.__EMPTY_16;
                    Object.assign(tempChcBusinesDoc, chcBusinesDoc);
                    chcMarketDefinitions.push(tempChcBusinesDoc);
                    tempChcBusinesDoc = {};
                }
                if (mapKeys[rowKey] === "Belgium") {
                    tempChcBusinesDoc.country = mapKeys[rowKey];
                    tempChcBusinesDoc.rx = Math.round(100 * row.__EMPTY_17).toString();
                    tempChcBusinesDoc.otc = Math.round(100 * row.__EMPTY_18).toString();
                    tempChcBusinesDoc.includeRx = row.__EMPTY_19;
                    Object.assign(tempChcBusinesDoc, chcBusinesDoc);
                    chcMarketDefinitions.push(tempChcBusinesDoc);
                    tempChcBusinesDoc = {};
                }
                if (mapKeys[rowKey] === "Czech Republic") {
                    tempChcBusinesDoc.country = mapKeys[rowKey];
                    tempChcBusinesDoc.rx = Math.round(100 * row.__EMPTY_20).toString();
                    tempChcBusinesDoc.otc = Math.round(100 * row.__EMPTY_21).toString();
                    tempChcBusinesDoc.includeRx = row.__EMPTY_22;
                    Object.assign(tempChcBusinesDoc, chcBusinesDoc);
                    chcMarketDefinitions.push(tempChcBusinesDoc);
                    tempChcBusinesDoc = {};
                }
                if (mapKeys[rowKey] === "France") {
                    tempChcBusinesDoc.country = mapKeys[rowKey];
                    tempChcBusinesDoc.rx = Math.round(100 * row.__EMPTY_23).toString();
                    tempChcBusinesDoc.otc = Math.round(100 * row.__EMPTY_24).toString();
                    tempChcBusinesDoc.unknown = Math.round(100 * row.__EMPTY_25).toString();
                    tempChcBusinesDoc.includeRx = row.__EMPTY_26;
                    Object.assign(tempChcBusinesDoc, chcBusinesDoc);
                    chcMarketDefinitions.push(tempChcBusinesDoc);
                    tempChcBusinesDoc = {};
                }
                if (mapKeys[rowKey] === "Germany") {
                    tempChcBusinesDoc.country = mapKeys[rowKey];
                    tempChcBusinesDoc.rx = Math.round(100 * row.__EMPTY_27).toString();
                    tempChcBusinesDoc.otc = Math.round(100 * row.__EMPTY_28).toString();
                    tempChcBusinesDoc.includeRx = row.__EMPTY_29;
                    Object.assign(tempChcBusinesDoc, chcBusinesDoc);
                    chcMarketDefinitions.push(tempChcBusinesDoc);
                    tempChcBusinesDoc = {};
                }
                if (mapKeys[rowKey] === "Hungary") {
                    tempChcBusinesDoc.country = mapKeys[rowKey];
                    tempChcBusinesDoc.rx = Math.round(100 * row.__EMPTY_30).toString();
                    tempChcBusinesDoc.otc = Math.round(100 * row.__EMPTY_31).toString();
                    tempChcBusinesDoc.includeRx = row.__EMPTY_32;
                    Object.assign(tempChcBusinesDoc, chcBusinesDoc);
                    chcMarketDefinitions.push(tempChcBusinesDoc);
                    tempChcBusinesDoc = {};
                }
                if (mapKeys[rowKey] === "Italy") {
                    tempChcBusinesDoc.country = mapKeys[rowKey];
                    tempChcBusinesDoc.rx = Math.round(100 * row.__EMPTY_33).toString();
                    tempChcBusinesDoc.otc = Math.round(100 * row.__EMPTY_34).toString();
                    tempChcBusinesDoc.includeRx = row.__EMPTY_35;
                    Object.assign(tempChcBusinesDoc, chcBusinesDoc);
                    chcMarketDefinitions.push(tempChcBusinesDoc);
                    tempChcBusinesDoc = {};
                }
                if (mapKeys[rowKey] === "Poland") {
                    tempChcBusinesDoc.country = mapKeys[rowKey];
                    tempChcBusinesDoc.rx = Math.round(100 * row.__EMPTY_36).toString();
                    tempChcBusinesDoc.otc = Math.round(100 * row.__EMPTY_37).toString();
                    tempChcBusinesDoc.includeRx = row.__EMPTY_38;
                    Object.assign(tempChcBusinesDoc, chcBusinesDoc);
                    chcMarketDefinitions.push(tempChcBusinesDoc);
                    tempChcBusinesDoc = {};
                }
                if (mapKeys[rowKey] === "Slovakia") {
                    tempChcBusinesDoc.country = mapKeys[rowKey];
                    tempChcBusinesDoc.rx = Math.round(100 * row.__EMPTY_39).toString();
                    tempChcBusinesDoc.otc = Math.round(100 * row.__EMPTY_40).toString();
                    tempChcBusinesDoc.includeRx = row.__EMPTY_41;
                    Object.assign(tempChcBusinesDoc, chcBusinesDoc);
                    chcMarketDefinitions.push(tempChcBusinesDoc);
                    tempChcBusinesDoc = {};
                }
                if (mapKeys[rowKey] === "Spain") {
                    tempChcBusinesDoc.country = mapKeys[rowKey];
                    tempChcBusinesDoc.rx = Math.round(100 * row.__EMPTY_42).toString();
                    tempChcBusinesDoc.otc = Math.round(100 * row.__EMPTY_43).toString();
                    tempChcBusinesDoc.unknown = Math.round(100 * row.__EMPTY_44).toString();
                    tempChcBusinesDoc.includeRx = row.__EMPTY_45;
                    Object.assign(tempChcBusinesDoc, chcBusinesDoc);
                    chcMarketDefinitions.push(tempChcBusinesDoc);
                    tempChcBusinesDoc = {};
                }
                if (mapKeys[rowKey] === "Switzerland") {
                    tempChcBusinesDoc.country = mapKeys[rowKey];
                    tempChcBusinesDoc.rx = Math.round(100 * row.__EMPTY_46).toString();
                    tempChcBusinesDoc.otc = Math.round(100 * row.__EMPTY_47).toString();
                    tempChcBusinesDoc.includeRx = row.__EMPTY_48;
                    Object.assign(tempChcBusinesDoc, chcBusinesDoc);
                    chcMarketDefinitions.push(tempChcBusinesDoc);
                    tempChcBusinesDoc = {};
                }
                if (mapKeys[rowKey] === "Australia*") {
                    tempChcBusinesDoc.country = mapKeys[rowKey];
                    tempChcBusinesDoc.rx = Math.round(100 * row.__EMPTY_49).toString();
                    tempChcBusinesDoc.otc = Math.round(100 * row.__EMPTY_50).toString();
                    tempChcBusinesDoc.unknown = Math.round(100 * row.__EMPTY_51).toString();
                    tempChcBusinesDoc.includeRx = row.__EMPTY_52;
                    Object.assign(tempChcBusinesDoc, chcBusinesDoc);
                    chcMarketDefinitions.push(tempChcBusinesDoc);
                    tempChcBusinesDoc = {};
                }
                if (mapKeys[rowKey] === "Philippines") {
                    tempChcBusinesDoc.country = mapKeys[rowKey];
                    tempChcBusinesDoc.rx = Math.round(100 * row.__EMPTY_53).toString();
                    tempChcBusinesDoc.otc = Math.round(100 * row.__EMPTY_54).toString();
                    tempChcBusinesDoc.includeRx = row.__EMPTY_55;
                    Object.assign(tempChcBusinesDoc, chcBusinesDoc);
                    chcMarketDefinitions.push(tempChcBusinesDoc);
                    tempChcBusinesDoc = {};
                }
                if (mapKeys[rowKey] === "Russia*") {
                    tempChcBusinesDoc.country = mapKeys[rowKey];
                    tempChcBusinesDoc.rx = Math.round(100 * row.__EMPTY_56).toString();
                    tempChcBusinesDoc.otc = Math.round(100 * row.__EMPTY_57).toString();
                    tempChcBusinesDoc.includeRx = row.__EMPTY_58;
                    Object.assign(tempChcBusinesDoc, chcBusinesDoc);
                    chcMarketDefinitions.push(tempChcBusinesDoc);
                    tempChcBusinesDoc = {};
                }
                if (mapKeys[rowKey] === "South Africa") {
                    tempChcBusinesDoc.country = mapKeys[rowKey];
                    tempChcBusinesDoc.rx = Math.round(100 * row.__EMPTY_59).toString();
                    tempChcBusinesDoc.otc = Math.round(100 * row.__EMPTY_60).toString();
                    tempChcBusinesDoc.unknown = Math.round(100 * row.__EMPTY_61).toString();
                    tempChcBusinesDoc.includeRx = row.__EMPTY_62;
                    Object.assign(tempChcBusinesDoc, chcBusinesDoc);
                    chcMarketDefinitions.push(tempChcBusinesDoc);
                    tempChcBusinesDoc = {};
                }
                if (mapKeys[rowKey] === "South Korea") {
                    tempChcBusinesDoc.country = mapKeys[rowKey];
                    tempChcBusinesDoc.rx = Math.round(100 * row.__EMPTY_63).toString();
                    tempChcBusinesDoc.otc = Math.round(100 * row.__EMPTY_64).toString();
                    tempChcBusinesDoc.includeRx = row.__EMPTY_65;
                    Object.assign(tempChcBusinesDoc, chcBusinesDoc);
                    chcMarketDefinitions.push(tempChcBusinesDoc);
                    tempChcBusinesDoc = {};
                }
                if (mapKeys[rowKey] === "Taiwan") {
                    tempChcBusinesDoc.country = mapKeys[rowKey];
                    tempChcBusinesDoc.rx = Math.round(100 * row.__EMPTY_66).toString();
                    tempChcBusinesDoc.otc = Math.round(100 * row.__EMPTY_67).toString();
                    tempChcBusinesDoc.includeRx = row.__EMPTY_68;
                    Object.assign(tempChcBusinesDoc, chcBusinesDoc);
                    chcMarketDefinitions.push(tempChcBusinesDoc);
                    tempChcBusinesDoc = {};
                }
                if (mapKeys[rowKey] === "Global") {
                    tempChcBusinesDoc.country = mapKeys[rowKey];
                    tempChcBusinesDoc.rx = Math.round(100 * row.__EMPTY_71).toString();
                    tempChcBusinesDoc.otc = Math.round(100 * row.__EMPTY_72).toString();
                    //Object.keys(chcBusinesDoc).forEach(key1=> tempChcBusinesDoc[key1]=chcBusinesDoc[key1])
                    Object.assign(tempChcBusinesDoc, chcBusinesDoc);
                    chcMarketDefinitions.push(tempChcBusinesDoc);
                    tempChcBusinesDoc = {};
                }

            }

        }

    }

    ChcAlignment.insertMany(chcMarketDefinitions).then(result => {
        res.send(result);
    })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });
};

export const getChcAlignments = (req: Request, res: Response) => {
    ChcAlignment.find()
        .then(chcAlignmentData => {
            res.send(chcAlignmentData);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });
};

export const getChcChangeRequest = (req: Request, res: Response) => {
    ChangeRequest.find()
        .then(chcChangeRequestData => {
            res.send(chcChangeRequestData);

        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });
};

export const addRequest = (req: Request, res: Response) => {
    
    const user: any = req.user;

    const mailList = ["govindarajmrp@gmail.com"];
    const message = `${req.body.comment}`;
    const subject = "Change Request";
    const template = `
        <table border=1>
        <thead>
        <tr>
        <th>Country</th>
        <th>MegaCategory</th>
        <th>Category</th>
        <th>Atc4Description</th>
      </tr>
    </thead>
    <tr>
      <td>${req.body.country}</td>
      <td>${req.body.megaCategory}</td>
      <td>${req.body.category}</td>
      <td>${req.body.atc4Description}</td>
    </tr>
    </table>
    <span><a href="localhost:3000/chc-alignement/approve/${req.params.currentDocumentId}">Approve Request</a></span>  
    <span><a href="localhost:3000/chc-alignement/reject/${req.params.currentDocumentId}">Reject Request</a></span>
    `;

    ChangeRequest.create({
        userId: user._id,
        country: req.body.country,
        megaCategory: req.body.megaCategory,
        category: req.body.category,
        atc4Description: req.body.atc4Description,
        comment: req.body.comment,
        status: "NEW",
        reason:"NEW"
    })
        .then(ChangeRequest => {
            res.send(ChangeRequest);
           
            Mailer.sendMail(mailList, message, subject, template).then((response) => {
                console.log("Mail sent", response);
            }).catch((error) => {
                console.log(error);
            });

        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });
};

export const changeRequestApproved = (req: Request, res: Response) => { 
    ChangeRequest.findOneAndUpdate({ _id: req.params.currentDocumentId }, {
        status: "APPROVED",
    })
        .then((response) => {
            res.send({ message: response });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred"
            });
        });
};

export const changeRequestRejected = (req: Request, res: Response) => {
    ChangeRequest.findOneAndUpdate({ _id: req.params.currentDocumentId }, {
        reason: req.params.reason,
        status: "REJECTED",
    })
        .then((response) => {
            res.send({ message: response });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred"
            });
        });
};


export const getId = (req: Request, res: Response) => { 
    ChangeRequest.find({ _id: req.params.currentDocumentId })
        .then((response) => {
           // res.send({ message: response });
           res.send(response); 

        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred"
            });
        });
};





