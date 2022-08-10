import { FileSetting } from "./../../shared/models/FileSetting";
import { Request, Response } from "express";
import {
  FileSubDocument,
  FileUpload,
  SheetsDocument
} from "../../shared/models/FileUpload";
import { DataLoadSetting } from "../../shared/models/DataLoadSetting";
import { ColumnSetting } from "../../shared/models/ColumnSetting";
import { FileUploadError } from "../../shared/models/FileUploadError";
import * as path from "path";
import { appConfig } from "../../appConfig";
import * as childProcess from "child_process";
import { MarketSale } from "../../shared/models/MarketSale";
import * as fs from "fs";
import Mailer from "./../../shared/lib/mailer/mailer";
import { ColumnOrder } from "./../../shared/lib/dataLoad/order";
const moment = require("moment");
const uniqueString = require("unique-string");
const unzipper = require("unzipper");
const etl = require("etl");
import moveFile from "move-file";
import makeDir from "make-dir";


/**
 * Uploads files
 * @param {e.Request} req
 * @param {e.Response} res
 */
export const index = (req: Request, res: Response) => {
  const files: any = req.files;

  if (
    files.length === 1 &&
    files[0].originalname.split(".").pop().toLowerCase() === "zip"
  ) {
    const uploadPath = `${path.resolve(
      `${appConfig.assets.dataLoad.rawFiles}`
    )}`;
    const extractedFiles: any = [];
    fs.createReadStream(`${uploadPath}/${files[0].filename}`)
      .pipe(unzipper.Parse())
      .pipe(
        etl.map((entry: any) => {
          const ext = entry.path.split(".").pop();
          const outputFileName: any = `${uniqueString()}.${ext}`.toLowerCase();
          return entry
            .pipe(etl.toFile(`${uploadPath}/${outputFileName}`))
            .promise()
            .then((status: any) => {
              if (status[0] === true) {
                extractedFiles.push({
                  filename: outputFileName,
                  originalName: entry.path,
                  size: entry.vars.uncompressedSize
                });
              }
            });
        })
      )
      .promise()
      .then(() => {
        res.json(extractedFiles);
      });
  } else {
    const fileList = (req.files as any).map((file: any) => ({
      filename: file.filename.toLowerCase(),
      originalName: file.originalname,
      size: file.size
    }));
    res.json(fileList);
  }
};

/**
 * Save file details
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Response}
 */
export const save = (req: Request, res: Response) => { 
  if (!req.body.settingId || !req.body.fileDetails) {
      return res.json({ error: "invalid request" });
  }
  DataLoadSetting
      .findOne({ _id: req.body.settingId })
      .populate("countryId")
      .then((dataLoadSetting: any) => {
          const user: any = req.user;
          const fileUploadDoc: any = {};
          fileUploadDoc.dataLoadSetting = dataLoadSetting._id;
          fileUploadDoc.country = dataLoadSetting.countryId._id;
          fileUploadDoc.fileDate = new Date((new Date(req.body.fileDate)).getTime() - (req.body.fileDateOffset * 60000));
          fileUploadDoc.fileDateOffset = req.body.fileDateOffset;
          fileUploadDoc.currentTotalMarketSales = null;
          fileUploadDoc.previousTotalMarketSales = null;
          fileUploadDoc.growth = null;
          fileUploadDoc.totalMarketSales = null;
          fileUploadDoc.totalMarketSalesVariation = null;
          fileUploadDoc.uploadedBy = user._id;
          fileUploadDoc.files = [];

          const newColumnSettings: any = [];
          const fileDetails = req.body.fileDetails;
          Object.keys(fileDetails).forEach((fKey: any) => {
              const file = fileDetails[fKey];
              const fileDoc = {
                  fileSetting: file.fileSetting,
                  fileName: file.fileName,
                  originalName: file.originalName,
                  fileSize: file.fileSize,
                  status: "READY",
                  batch: 0,
                  overriddenSettings: [] as any,
                  sheets: [] as any,
              };

              Object.keys(file.sheets).forEach((sKey: any) => {
                  const sheet = file.sheets[sKey];
                  const sheets = {
                      sheetSetting: sheet.sheetSetting,
                      noOfRows: -1,
                      noOfRowsProcessed: 0,
                      batch: 0,
                      status: "READY",
                  } as any;

                  if (sheet.newColumnMapping.length) {
                      const colSetting = new ColumnSetting({
                          sheetSetting: sheet.sheetSetting,
                          settingType: "OVERRIDDEN_SETTING",
                          mapping: sheet.newColumnMapping
                      });
                      newColumnSettings.push(colSetting);
                      sheets.overriddenColumnSetting = colSetting._id;
                  }
                  fileDoc.sheets.push(sheets);
              });
              fileUploadDoc.files.push(fileDoc);
          });

          ColumnSetting.create(newColumnSettings).then(() => {
              return FileUpload.create(fileUploadDoc);
          }).then((data: any) => {
              res.json(data);
          }).catch((e: any) => {
              res.json(e);
          });
      });
};



/**
 * Get previous upload id
 * @param {e.Request} req
 * @param {e.Response} res
 */
export const getPreviousFileUpload = (req: Request, res: Response) => {
    FileUpload.findOne({ _id: req.params.currentFileUploadId })
        .then((response) => {
            const fileDate = new Date(response.fileDate);
            return FileUpload.find().and([
                { dataLoadSetting: response.dataLoadSetting },
                { "$expr": { "$eq": [{ "$month": "$fileDate" }, fileDate.getMonth() === 0 ? 12 : fileDate.getMonth()] } }]);
        })
        .then((response) => {
            res.json(response);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred"
            });
        });
};

/**
 * Get file upload details by id
 * @param {e.Request} req
 * @param {e.Response} res
 */
export const getById = (req: Request, res: Response) => {
  FileUpload.findOne({ _id: req.params.fileUploadId })
    .lean()
    .then((uploadInfo: any) => {
      res.send(uploadInfo);
    });
};

/**
 * Get latest file upload details
 * @param {e.Request} req
 * @param {e.Response} res
 */
export const getLatestFileUpload = (req: Request, res: Response) => {
  FileUpload.find({ dataLoadSetting: req.params.dataLoadSetting as any })
    .sort({ fileDate: -1 })
    .limit(1)
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred"
      });
    });
};

export const getFileStatus = (req: Request, res: Response) => {
  FileUpload.findById(req.params.fileUploadId)
    .then((response) => {
      const status = response ? response.status : { message: "no file" };
      res.json(status);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred"
      });
    });
};

/**
 * Get file upload error details
 * @param {e.Request} req
 * @param {e.Response} res
 */
export const getErrors = (req: Request, res: Response) => {
  FileUploadError.find({
    fileUpload: req.params.fileUploadId as any,
    fileSetting: req.params.fileSettingId as any,
    sheetSetting: req.params.sheetSettingId as any
  }).then((data: any) => {
            res.json(data);
        }).catch((e: any) => {
            console.log("Errr:", e);
        });
};

/**
 * Download cleaned files
 * @param {e.Request} req
 * @param {e.Response} res
 */
export const downloadCleanedFile = (req: Request, res: Response) => {
  FileUpload.findById(req.params.fileUploadId)
    .populate("country")
    .populate("dataLoadSetting")
    .then((fileUpload: any) => {
        console.log("fileUpload: ", );
      if (fileUpload.status!=="APPROVED") {

        const sheets: any = [];
        let command: string = "";
        fileUpload.files.forEach((file: FileSubDocument) => {
          if (file.sheets) {
            file.sheets.forEach((sheet: SheetsDocument) => {
              sheets.push(sheet._id);
              if (command === "") {
                command = `cat ${path.resolve(
                  `${appConfig.assets.dataLoad.rawFiles}/${sheet.sheetSetting}.csv`
                )}`;
              } else {
                command =
                  command +
                  ` <(cat ${path.resolve(
                    `${appConfig.assets.dataLoad.rawFiles}/${sheet.sheetSetting}.csv`
                  )} | sed 1d)`;
              }
            });
          }
        });

        const cleanedFile = `${path.resolve(
          `${appConfig.assets.dataLoad.rawFiles}/${req.params.fileUploadId}-cleaned.csv`
        )}`;

        // removes last 3 rows
        command =
          command + `| cut -d',' -f -${ColumnOrder.length - 3} >${cleanedFile}`;

        console.log(command);

        childProcess.execSync(command);

        const fileName = `${fileUpload.dataLoadSetting.dataType}.csv`;
        res.download(cleanedFile, fileName);
      }
      if (fileUpload.status==="APPROVED") {
        //uploads/data-load/Archives/${moment(response.fileDate).format('YYYY-MM')}/${response._id}_${response.country.name}_${response.dataLoadSetting.settingName}

        const sheets: any = [];
        let command: string = "";
        fileUpload.files.forEach((file: FileSubDocument) => {
          if (file.sheets) {
            file.sheets.forEach((sheet: SheetsDocument) => {
              
              sheets.push(sheet._id);
              if (command === "") {
                command = `cat ${path.resolve(
                  `uploads/data-load/Archives/${moment(fileUpload.fileDate).format("YYYY-MM")}/${fileUpload._id}_${fileUpload.country.name}_${fileUpload.dataLoadSetting.settingName}/${sheet.sheetSetting}.csv`
                )}`;
              } else {
                command =
                  command +
                  ` <(cat ${path.resolve(
                    `uploads/data-load/Archives/${moment(fileUpload.fileDate).format("YYYY-MM")}/${fileUpload._id}_${fileUpload.country.name}_${fileUpload.dataLoadSetting.settingName}/${sheet.sheetSetting}.csv`
                  )} | sed 1d)`;
              }
            });
          }
        });

        const cleanedFile = `${path.resolve(
          `uploads/data-load/Archives/${moment(fileUpload.fileDate).format("YYYY-MM")}/${fileUpload._id}_${fileUpload.country.name}_${fileUpload.dataLoadSetting.settingName}/${req.params.fileUploadId}-cleaned.csv`
        )}`;

        // removes last 3 rows
        command =
          command + `| cut -d',' -f -${ColumnOrder.length - 3} >${cleanedFile}`;

        console.log(command);

        childProcess.execSync(command);

        const fileName = `${fileUpload.dataLoadSetting.dataType}.csv`;
        res.download(cleanedFile, fileName);
      }
    })
    .catch((err) => {
      console.log("error in catch", err);

      res.status(500).send({
        message: err.message || "Some error occurred"
      });
    });
};

/**
 * File upload details
 * @param {e.Request} req
 * @param {e.Response} res
 */
export const fileUploadDetails = (req: Request, res: Response) => {
  FileUpload.findById(req.params.fileUploadId)
    .populate("country")
    .populate("dataLoadSetting")
    .then((fileUpload: any) => {
      res.send({ fileUpload: fileUpload });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred"
      });
    });
};

/**
 * Approve valid files
 * @param req
 * @param res
 */
export const fileApproved = (req: Request, res: Response) => {
  const query: any = [];

  for (let index = 1; index <= 37; index++) {
    query.push(
      `$LC${index.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      })}`
    );
  }

  MarketSale.aggregate([
    {
      $match: {
        fileUploadId: {
          $in: [req.params.currentFileUploadId, req.params.previousFileUploadId]
        }
      }
    },
    {
      $group: {
        _id: null,
        currentTotalAmount: {
          $sum: {
            $sum: {
              $cond: [
                {
                  $eq: ["$fileUploadId", req.params.currentFileUploadId]
                },
                query,
                0
              ]
            }
          }
        },
        previousTotalAmount: {
          $sum: {
            $sum: {
              $cond: [
                {
                  $eq: ["$fileUploadId", req.params.previousFileUploadId]
                },
                query,
                0
              ]
            }
          }
        }
      }
    },
    {
      $addFields: {
        growth: {
          $cond: [
            {
              $eq: ["$previousTotalAmount", 0]
            },
            -1,
            {
              $divide: [
                { $subtract: ["$currentTotalAmount", "$previousTotalAmount"] },
                "$previousTotalAmount"
              ]
            }
          ]
        }
      }
    }
  ]).then((response) => {
    console.log(response);

    FileUpload.findOneAndUpdate(
      { _id: req.params.currentFileUploadId },
      {
        status: "APPROVED" as any,
        previousTotalMarketSales: response[0].previousTotalAmount as any,
        currentTotalMarketSales: response[0].currentTotalAmount as any,
        growth: response[0].growth as any
      }
    ).populate("files.fileSetting").populate("country").populate("dataLoadSetting")
     .then((response) => {

        async function archive(fileName,response) {
            // create the directory
            await makeDir(`uploads/data-load/Archives/${moment(response.fileDate).format("YYYY-MM")}/${response._id}_${response.country.name}_${response.dataLoadSetting.settingName}`);
            try {
                // move file
              await moveFile(
                `uploads/data-load/raw-files/${fileName}`, // from 
                `uploads/data-load/Archives/${moment(response.fileDate).format("YYYY-MM")}/${response._id}_${response.country.name}_${response.dataLoadSetting.settingName}/${fileName}` // to
              );
              console.log(`${fileName} file has been moved`);
            } catch {
                console.log(`${fileName} file not found`);
            }
          };

        response.files.forEach((eachFile: any) => {
            console.log(eachFile.fileName);
            archive(eachFile.fileName,response);
            eachFile.fileSetting.sheetSettings.forEach((eachSheet) => {
                console.log(eachFile.fileName.replace(".xlsx","")+"_"+eachSheet.sheetName.concat(".csv"));
                console.log(eachSheet._id.toString().concat(".csv"));

               archive(eachSheet._id.toString().concat(".csv"),response);
                archive(eachFile.fileName.replace(".xlsx","")+"_"+eachSheet.sheetName.concat(".csv"),response);
            });});
          

        const fileDate = new Date(response.fileDate);
        return FileUpload.findOne().and([
          { dataLoadSetting: response.dataLoadSetting },
          { $expr: { $eq: [{ $month: "$fileDate" }, fileDate.getMonth() - 1] } }
        ]);
      })
      .then((fileUpload) => {
        console.log(fileUpload);
        return FileUpload.findOneAndDelete({ _id: fileUpload._id }).then(
          (response) => {
            return MarketSale.deleteMany({ fileUploadId: response._id });
          }
        );
      })
      .then((response) => {
        // Mailer.sendMail(["someemail@solutionec.com"],"message","subject","template");
        res.send({ message: response });
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred"
        });
      });
  });
};

/**
 *
 * @param req
 * @param res
 */
export const fileRejected = (req: Request, res: Response) => {
    FileUpload.findOneAndDelete({ _id: req.params.currentFileUploadId })
        .then((fileUpload) => {
            return MarketSale.deleteMany({ fileUploadId: fileUpload._id });
        }).then((response) => {
            res.send({ message: response });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred"
            });
        });
};

/**
 *
 * @param req
 * @param res
 */
export const dailyMail = (req: Request, res: Response) => {
  Mailer.dailyMail();
};
