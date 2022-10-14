import { SheetSettingDocument } from "./../../shared/models/SheetSetting";

import { Request, Response } from "express";
import { DataLoadSetting } from "../../shared/models/DataLoadSetting";
import path from "path";
import mongoose from "mongoose";
import { ColumnSetting } from "../../shared/models/ColumnSetting";
import { MasterColumn } from "../../shared/models/MasterColumn";
import { FileSetting } from "../../shared/models/FileSetting";
import { FileUpload } from "../../shared/models/FileUpload";

const fs = require("fs");

/**
 * Get data by country
 * @param {e.Request} req
 * @param {e.Response} res
 */
export const getByCountry = (req: Request, res: Response) => {
    DataLoadSetting.find({ countryId: req.query.countryId } as any)
        .then((response: any) => {
            res.send(response);
        }).catch((err: any) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });
};

/**
 * Delete files
 * @param {e.Request} req
 * @param {e.Response} res
 */
export const deleteFiles = (req: Request, res: Response) => {
    if (req.query.files) {
        req.query.files.toString().split(", ").forEach((file: string) => {
            const absPath = `${path.resolve("uploads")}/${file}`;
            fs.unlink(absPath, (err: any) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("DELETED: ", absPath);
                }
            });
        });
    }
    res.json(true);
};

/**
 * Returns panel configuration by panel id
 * @param {e.Request} req
 * @param {e.Response} res
 */
export const getSettings = (req: Request, res: Response) => {
    let result: any = {};
    DataLoadSetting.findOne({ _id: req.params.id }).populate("countryId").lean()
        .then((dataLoadSetting: any) => {
            result = dataLoadSetting;
            return FileSetting.find({ dataLoadSetting: req.params.id } as any)
                .populate({
                    path: "sheetSettings.columnSetting",
                    populate: {
                        path: "mapping.masterColumnId"
                    }
                })
                .lean();
        }).then((fileSettings: any) => {
            result.fileSettings = fileSettings;
            res.json(result);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving data."
            });
        });
};

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 */
export const getHomeData = (req: Request, res: Response) => {
    const user: any = req.user;
    const query = (user.role==="SuperAdmin")?{}:{"countryId": { $in: user.countries } };
    let homeData: any = [];
    DataLoadSetting.find(query)
        .populate("countryId").lean()
        .then((dataloadSettings: any) => {
            homeData = dataloadSettings;
            return Promise.all(dataloadSettings.map((dataloadSetting: any,index: number) => {
                return FileUpload.find({ "dataLoadSetting" : dataloadSetting._id })
                .sort({ "fileDate": -1 })
                .limit(2).lean();
            }));
        }).then((response: any) => {
            return response.map((item: any,index: number) => {
                return {...homeData[index],latestFileDate:item};});
           })
        .then((response) => {
             res.send(response);
        }
        ).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });
};

export const getById = (req: Request, res: Response) => {
    FileSetting.find({ dataLoadSetting: req.params.dataSettingId as any })
        .then((result: any) => {
            res.send(result);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });
};

/**
 *
 * @param req
 * @param res
 */
export const addDataLoadSetting = (req: Request, res: Response) => {
    const dataLoadSetting = req.body;
    let headers: any;

    MasterColumn.find().select("columnHeader _id").then((response: any) => {
        const masterColumnIndexed: any = {};
        headers = response.filter((obj: any) => ((!obj.columnHeader.startsWith("UN") && !obj.columnHeader.startsWith("LC") && !obj.columnHeader.startsWith("RX"))||(obj.columnHeader==="RX")));
        response.forEach((masterColumn: any) => {
            masterColumnIndexed[masterColumn.columnHeader] = masterColumn;
        });

        DataLoadSetting.create({
            "countryId": mongoose.Types.ObjectId(dataLoadSetting.country),
            "settingName": dataLoadSetting.settingName,
            "dataType": dataLoadSetting.dataType,
            "inputFileFrequency": dataLoadSetting.fileFrequency,
            "inputFileType": dataLoadSetting.fileType,
            "fileExpectedDate": dataLoadSetting.fileExpectedDate,
            "outputFileName": "",
            "outputFileType": dataLoadSetting.fileType,
            "numberOfInputFiles": dataLoadSetting.numberOfInputFiles
        }).then((response: any) => {
            dataLoadSetting.files.forEach((file: any) => {
                FileSetting.create({
                        "fileName": file.fileName,
                        "dataLoadSetting": mongoose.Types.ObjectId(response._id),
                        "noOfSheets": file.noOfSheets,
                        "sheetSettings": []
                    }).then((response) => {
                    file.sheetSetting.forEach((eachSheetSetting: any) => {
                        const id = mongoose.Types.ObjectId();
                        const sheet: any = {};
                        let columnSetting: any;
                        Object.keys(eachSheetSetting).forEach((setting) => {
                            if (setting !== "columnSetting") {
                                sheet[`${setting}`] = eachSheetSetting[`${setting}`];
                            }
                            if (setting === "columnSetting") {
                                columnSetting = eachSheetSetting[`${setting}`];
                            }
                        });
                        sheet._id = id;
                        sheet.columnSetting = new ColumnSetting;
                        FileSetting.updateOne({ "_id": response._id }, { $push: { "sheetSettings": sheet } }).then((response) => {
                            let unStart = eachSheetSetting.columnSetting.un;
                            let lcStart = eachSheetSetting.columnSetting.lc;
                            let rxStart = eachSheetSetting.columnSetting.rx;
                            const rxDirection = eachSheetSetting.columnSetting.rxDirection;
                            const unDirection = eachSheetSetting.columnSetting.unDirection;
                            const lcDirection = eachSheetSetting.columnSetting.lcDirection;

                            const mapping = headers.map((header: any) => {
                                return {
                                    "masterColumnId": header._id,
                                    "mapType": eachSheetSetting.columnSetting[`${header.columnHeader}Identifier`],
                                    "mapTypeValue": eachSheetSetting.columnSetting[`${header.columnHeader}`],
                                    "matchRule": eachSheetSetting.columnSetting[`${header.columnHeader}MatchRule`]
                                };
                            });

                            for (let i = eachSheetSetting.numberOfMonths; i >= 1; i--) {
                                const head = `LC${(i).toLocaleString("en-US", {
                                    minimumIntegerDigits: 2,
                                    useGrouping: false
                                })}`;
                                mapping.push({
                                    "masterColumnId": masterColumnIndexed[head]._id,
                                    "mapType": "position",
                                    "mapTypeValue": lcStart,
                                    "matchRule": ""
                                });
                                lcDirection === "a" ? lcStart++ : lcStart--;
                            }

                            for (let i = eachSheetSetting.numberOfMonths; i >= 1; i--) {
                                const head = `UN${(i).toLocaleString("en-US", {
                                    minimumIntegerDigits: 2,
                                    useGrouping: false
                                })}`;
                                mapping.push({
                                    "masterColumnId": masterColumnIndexed[head]._id,
                                    "mapType": "position",
                                    "mapTypeValue": unStart,
                                    "matchRule": ""
                                });
                                unDirection === "a" ? unStart++ : unStart--;
                            }

                            if (rxStart > 0) {
                                for (let i = eachSheetSetting.numberOfMonths; i >= 1; i--) {
                                    const head = `RX${(i).toLocaleString("en-US", {
                                        minimumIntegerDigits: 2,
                                        useGrouping: false
                                    })}`;
                                    mapping.push({
                                        "masterColumnId": masterColumnIndexed[head]._id,
                                        "mapType": "position",
                                        "mapTypeValue": rxStart,
                                        "matchRule": ""
                                    });
                                    rxDirection === "a" ? rxStart++ : rxStart--;
                                }
                            }

                            ColumnSetting.create({
                                "unStart": eachSheetSetting.columnSetting.un,
                                "rxStart": eachSheetSetting.columnSetting.rx,
                                "lcStart": eachSheetSetting.columnSetting.lc,
                                "unDirection": eachSheetSetting.columnSetting.unDirection,
                                "rxDirection": eachSheetSetting.columnSetting.rxDirection,
                                "lcDirection": eachSheetSetting.columnSetting.lcDirection,
                                "_id": sheet.columnSetting._id,
                                "sheetSetting": id,
                                "settingType": "MASTER_SETTING",
                                "mapping": mapping
                            }).then((response) => {
                                // console.log(response);
                                res.send({ message: "saved sucessfully" });
                            });
                        });
                    });
                });
            });
        }).catch((err: any) => {
            res.send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });
    });
};

export const deleteDataLoadSetting = (req: Request, res: Response) => {
    DataLoadSetting.findOneAndRemove({ _id: req.params.id }).then((response) => {
        // TO-DO - find a method to return all the deleted values
        FileSetting.find({ dataLoadSetting: req.params.id as any}).then((files) => {
            files.map((fileSettings) => {
                FileSetting.findByIdAndDelete(fileSettings._id).then((eachFileSetting) => {
                    eachFileSetting.sheetSettings.map((sheetSetting: any) => {
                        ColumnSetting.findOneAndRemove({ sheetSetting: sheetSetting._id }).then();
                    });
                }
                );
            });
        });
    })
        .then(() => {
            res.send({ message: "Settings deleted" });
        })
        .catch((error) => {
            res.send({ messager: "Error occured", error: error });
        });
};

/**
 *
 * @param req
 * @param res
 */
export const updateDataLoadSetting = (req: Request, res: Response) => {

    const dataLoadSetting = req.body;
    // res.send(dataLoadSetting)
    let headers: any;

    MasterColumn.find().then((response: any) => {
        const masterColumnIndexed: any = {};
        headers = response.filter((obj: any) => (!obj.columnHeader.startsWith("UN") && !obj.columnHeader.startsWith("LC") && !obj.columnHeader.startsWith("RX"))||(obj.columnHeader==="RX"));
        response.forEach((masterColumn: any) => {
            masterColumnIndexed[masterColumn.columnHeader] = masterColumn;
        });

        DataLoadSetting.findOneAndUpdate({ _id: dataLoadSetting._id }, {
            "settingName": dataLoadSetting.settingName,
            "dataType": dataLoadSetting.dataType,
            "inputFileFrequency": dataLoadSetting.fileFrequency,
            "inputFileType": dataLoadSetting.fileType,
            "fileExpectedDate": dataLoadSetting.fileExpectedDate,
            "outputFileName": "",
            "outputFileType": dataLoadSetting.fileType,
            "numberOfInputFiles": dataLoadSetting.numberOfInputFiles
        })
            .then((response: any) => {

                dataLoadSetting.files.forEach((file: any, fileIndex: number) => {

                    if (file.status === "deleted") {
                        FileSetting.findOneAndDelete({ _id: file._id }).then((deleted) => {
                            if (deleted) {
                                deleted.sheetSettings.forEach((sheetSetting) => {
                                    ColumnSetting.deleteOne({ sheetSetting: sheetSetting._id });
                                });
                            }
                        });
                    }

                    if (file.status !== "deleted") {
                        FileSetting.findOneAndUpdate({ _id: file._id },
                            {
                                "fileName": file.fileName,
                                "dataLoadSetting": response._id,
                                "noOfSheets": file.noOfSheets,
                                "sheetSettings": [] as any
                            }, { upsert: true })
                            .then((response) => {
                                file.sheetSetting.forEach((eachSheetSetting: any, sheetIndex: number) => {
                                    const cs = new ColumnSetting;

                                    FileSetting.updateOne({ "_id": response._id }, {
                                        $push: {
                                            "sheetSettings": {
                                                "columnSetting": cs._id,
                                                "multiplier":eachSheetSetting.multiplier,
                                                "_id": eachSheetSetting._id,
                                                "sheetName": eachSheetSetting.sheetName,
                                                "removeMoleculeDuplicates":eachSheetSetting.removeMoleculeDuplicates,
                                                "columnHeaderStartPosition": eachSheetSetting.columnHeaderStartPosition,
                                                "dataRowStartPosition": eachSheetSetting.dataRowStartPosition,
                                                "numberOfMonths": eachSheetSetting.numberOfMonths,
                                                "inputThousandSeparator": eachSheetSetting.inputThousandSeparator,
                                                "decimalSeparator": eachSheetSetting.decimalSeparator,
                                                "delimiter": eachSheetSetting.delimiter,
                                                "emptyValueIdentifier": eachSheetSetting.emptyValueIdentifier
                                            } as SheetSettingDocument
                                        }
                                    })
                                        .then((response) => {
                                            let unStart = eachSheetSetting.columnSetting.un;
                                            let lcStart = eachSheetSetting.columnSetting.lc;
                                            let rxStart = eachSheetSetting.columnSetting.rx;
                                            const rxDirection = eachSheetSetting.columnSetting.rxDirection;
                                            const unDirection = eachSheetSetting.columnSetting.unDirection;
                                            const lcDirection = eachSheetSetting.columnSetting.lcDirection;
                                            const mapping = headers.map((header: any) => {
                                                return {
                                                    "masterColumnId": header._id,
                                                    "mapType": eachSheetSetting.columnSetting[`${header.columnHeader}Identifier`],
                                                    "mapTypeValue": eachSheetSetting.columnSetting[`${header.columnHeader}`],
                                                    "matchRule": eachSheetSetting.columnSetting[`${header.columnHeader}MatchRule`]
                                                };
                                            });

                                            for (let i = eachSheetSetting.numberOfMonths; i >= 1; i--) {
                                                const head = `LC${(i).toLocaleString("en-US", {
                                                    minimumIntegerDigits: 2,
                                                    useGrouping: false
                                                })}`;
                                                mapping.push({
                                                    "masterColumnId": masterColumnIndexed[head]._id,
                                                    "mapType": "position",
                                                    "mapTypeValue": lcStart,
                                                    "matchRule": ""
                                                });
                                                lcDirection === "a" ? lcStart++ : lcStart--;
                                            }

                                            for (let i = eachSheetSetting.numberOfMonths; i >= 1; i--) {
                                                const head = `UN${(i).toLocaleString("en-US", {
                                                    minimumIntegerDigits: 2,
                                                    useGrouping: false
                                                })}`;
                                                mapping.push({
                                                    "masterColumnId": masterColumnIndexed[head]._id,
                                                    "mapType": "position",
                                                    "mapTypeValue": unStart,
                                                    "matchRule": ""
                                                });
                                                unDirection === "a" ? unStart++ : unStart--;
                                            }

                                            if (rxStart > 0) {
                                                for (let i = eachSheetSetting.numberOfMonths; i >= 1; i--) {
                                                    const head = `RX${(i).toLocaleString("en-US", {
                                                        minimumIntegerDigits: 2,
                                                        useGrouping: false
                                                    })}`;
                                                    mapping.push({
                                                        "masterColumnId": masterColumnIndexed[head]._id,
                                                        "mapType": "position",
                                                        "mapTypeValue": rxStart,
                                                        "matchRule": ""
                                                    });
                                                    rxDirection === "a" ? rxStart++ : rxStart--;
                                                }
                                            }
                                            ColumnSetting.deleteOne({ "sheetSetting": eachSheetSetting._id }).then(() => {
                                                ColumnSetting.create({
                                                    "_id": cs._id,
                                                    "unStart": eachSheetSetting.columnSetting.un,
                                                    "rxStart": eachSheetSetting.columnSetting.rx,
                                                    "lcStart": eachSheetSetting.columnSetting.lc,
                                                    "unDirection": eachSheetSetting.columnSetting.unDirection,
                                                    "rxDirection": eachSheetSetting.columnSetting.rxDirection,
                                                    "lcDirection": eachSheetSetting.columnSetting.lcDirection,
                                                    "sheetSetting": eachSheetSetting._id,
                                                    "settingType": "MASTER_SETTING",
                                                    "mapping": mapping
                                                })
                                                    .then((response) => {
                                                        res.send({ message: "updated sucessfully" });
                                                    });
                                            });
                                        });
                                });
                            });

                    }
                });
            }).catch((err: any) => {
                res.send({
                    message: err.message || "Some error occurred while retrieving notes."
                });
            });
    });
};
