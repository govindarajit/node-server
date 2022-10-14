import { MarketSale } from "./../../models/MarketSale";
import makeDir from "make-dir";
import moveFile from "move-file";
import { FileUploadError } from "./../../models/FileUploadError";
import path from "path";
import * as fastCsv from "fast-csv";
import { FileUpload } from "../../models/FileUpload";
import { exec } from "child_process";
import { Subscriber } from "rxjs/internal-compatibility";
import * as fs from "fs";
import { isNumeric } from "../../util/common";
import { appConfig } from "../../../appConfig";
import { Observable } from "rxjs/index";
import logger from "../../util/logger";
import { ColumnOrder } from "./order";
const _ = require("lodash");
const md5 = require("md5");
const XLSX = require("xlsx");
const moment = require("moment");
import * as childProcess from "child_process";
const { writeToPath } = require("@fast-csv/format");

export default class DataLoad {

    /**
     * Process start time
     */
    public start: any;

    /**
     * Validation errors
     * @type {{}}
     */
    public validationErrors: any = {};

    /**
     *  File upload settings
     */
    public fileUploadSettings: any;

    /**
     * File upload id
     */
    public fileUploadId: string;

    /**
     * Subscriber object
     */
    public subscriber: Subscriber<any>;


    public readonly delimiter: any = {
        "semiColon": ";",
        "space": " ",
        "comma": ","
    };


    public emptyValueIdentifierMap: any = {
        hyphen: "-",
        blank: ""
    };


    public firstTimeFileUpload = false;


    public batch: number;

    public columnOrderIndexed: any = {};

    constructor() {
        // this.start = new Date();
        ColumnOrder.forEach((value: any, index: number) => this.columnOrderIndexed[value] = index);
    }


    public import(data: any) {
        this.fileUploadId = data.fileUploadId;
        return new Observable((subscriber: any) => {
            this.subscriber = subscriber;
            this.getFileUploadSettings(this.fileUploadId).then((settings: any) => {
                this.fileUploadSettings = settings;
                this.firstTimeFileUpload = data.firstTimeFileUpload;
                this.fileUploadStatus(this.fileUploadId, "PROCESSING").then();
                this.processFiles(settings);
            });
        }
        );
    }


    /**
     * Process files based on the settings.
     * @param settings
     */
    public processFiles(settings: any) {
        try {
            let csvFiles: any = [];
            settings.files.forEach((file: any) => {
                this.updateFileStatus("PROCESSING", this.fileUploadId, file.fileSetting._id).then();
                const sheetPromises: any = file.fileSetting.sheetSettings.map((sheetSetting: any) => {
                    return this.processFile(file, sheetSetting, file.overriddenSettingsIndexed)
                        .then((data: any) => {
                            const [rows, status] = data;
                            if (status === "PROCESSED") {
                                return this.createImportFile(rows, file.fileSetting._id, sheetSetting._id);
                            } else {
                                return new Promise((resolve: any) => resolve([]));
                            }
                        });
                });

                Promise.all(sheetPromises).then((csvs: any) => {
                    csvFiles = csvs.map((csv: any) => csv.file);
                    return this.getUnProcessedSheets(this.fileUploadId);
                })
                    .then((data: any) => {
                        if (data.length === 0) {
                            this.updateFileStatus("READY_FOR_DB_IMPORT", this.fileUploadId, file.fileSetting._id)
                                .then(() => {
                                    this.isReadyForDbImport(csvFiles);
                                });
                        } else {
                            this.updateFileStatus("ERROR", this.fileUploadId, file.fileSetting._id).then();
                            this.fileUploadStatus(this.fileUploadId, "ERROR").then();
                        }
                    })
                    .catch((error: any) => {
                        this.subscriber.next({ message: "ERROR", data: error });
                        logger.error({ message: "ERROR", data: error });
                        this.updateFileStatus("ERROR", this.fileUploadId, file.fileSetting._id).then();
                        this.fileUploadStatus(this.fileUploadId, "ERROR").then();
                    });
            });
        } catch (e) {
            logger.debug("processFiles E >", e);
        }
    }


    /**
     * Process file
     * @param fileSetting 
     * @param sheetSetting 
     * @param overriddenSettingsIndexed 
     */
    public processFile(fileSetting: any, sheetSetting: any, overriddenSettingsIndexed: any) {

        return new Promise((resolve: any, reject: any) => {
            try {

                switch (this.fileUploadSettings.dataLoadSetting.inputFileType) {
                    case "xlsb":
                    case "xlsx": {
                        this.convertToCsv(fileSetting.fileName, sheetSetting.sheetName).then((response: any) => {
                            const [status, outputFile] = response;
                            if (status) {
                                sheetSetting.delimiter = "comma";
                                this.processSheet(fileSetting, sheetSetting, overriddenSettingsIndexed, outputFile)
                                    .then((response: any) => resolve(response));
                            }
                        });
                        break;
                    }

                    case "csv": {
                        const file = `${path.resolve(`${appConfig.assets.dataLoad.rawFiles}/${fileSetting.fileName}`)}`;
                        return this.processSheet(fileSetting, sheetSetting, overriddenSettingsIndexed, file)
                            .then((response: any) => resolve(response));
                        break;
                    }
                }
            } catch (e) {
                logger.debug("Process file excel dataload >>", e);
            }
        });
    }



    /**
     * Process sheet
     * @param  {any} fileSetting
     * @param  {any} sheetSetting
     * @param  {any} overriddenSettingsIndexed
     * @param  {string} file
     */
    public processSheet(fileSetting: any, sheetSetting: any, overriddenSettingsIndexed: any, file: string) {
        return new Promise((resolve: any, reject: any) => {
            try {
                const bprParams = this.beforeProcessRow({ fileType: "csv", fileSetting, sheetSetting, overriddenSettingsIndexed, file });
                const {
                    columnConfig,
                    sheet,
                    columnHeaderStartPosition,
                    dataRowStartPosition,
                    moleculeDuplicates,
                    matchRules,
                    rows } = bprParams;

                let { noOfColumns } = bprParams;
                let rowIndex = 0;

                fs.createReadStream(file)
                    .pipe(fastCsv.parse({
                        headers: false,
                        delimiter: this.delimiter[sheetSetting.delimiter],
                    }).on("error", error => console.error(error))
                        .on("data", (row: any) => {
                            const rowValues = Object.values(row);
                            const isEmptyRow = rowValues.join("") === "";
                            noOfColumns = Object.keys(row).length;


                            if (rowValues.length === 0 || rowValues.length === 1) {
                                logger.info(["Wrong delimiter.."]);
                                throw new Error("Wrong delimiter..");
                            }


                            if (rowIndex >= columnHeaderStartPosition && !isEmptyRow) {
                                this.processRow({
                                    fileType: "csv",
                                    sheet,
                                    noOfColumns,
                                    rowIndex,
                                    columnHeaderStartPosition,
                                    dataRowStartPosition,
                                    fileSetting,
                                    sheetSetting,
                                    columnConfig,
                                    matchRules,
                                    moleculeDuplicates,
                                    rows,
                                    rowValues
                                });
                            }


                            if (!isEmptyRow) {
                                rowIndex++;
                            }

                            // Split the output to handle memory efficiently
                            // if(rows.length % 150000 === 0) {

                            //     const rowsWriteCopy = JSON.parse(JSON.stringify(rows));
                            //     rows = [];

                            //     const orderArray = Object.keys(order);

                            // }

                        })
                        .on("end", () => {
                            this.finalizeProcessFile({
                                resolve,
                                batch: this.batch,
                                rows,
                                sheetSetting,
                                fileSetting
                            });
                        }));
            } catch (e) {
                logger.debug("Process file excel dataload >>", e);
            }
        });

    }

    /**
     * Convert xlsx and xlsb files to csv
     * @param  {any} fileName
     * @param  {any} sheetName
     */
    convertToCsv(fileName: any, sheetName: any) {
        return new Promise((resolve: any, reject: any) => {
            const uploadedFile = `${path.resolve(`${appConfig.root}/${appConfig.assets.dataLoad.rawFiles}/${fileName}`)}`;
            const execCreateCsv: any = (covertCmd: any, outputFile: any, sheet) => {
                exec(covertCmd, (error: any, stdout: any, stderr: any) => {

                    if (error) {
                        logger.debug(["point one", stderr]);
                        reject([false, outputFile]);
                    }

                    // TODO Why output coming in stderr
                    if (stdout.trim() === sheet || stderr.trim() === sheet) {
                        resolve([true, outputFile]);
                    }
                });
            };


            const sheetListCmd = `node ${appConfig.cmdXlsx} -f ${uploadedFile} --list-sheets`;
            exec(sheetListCmd, (error: any, stdout: any, stderr: any) => {
                if (error) {
                   
                    logger.debug(stderr);
                    reject([false, ""]);
                }

                let sheetList = (stdout.trim() || stderr.trim());
                sheetList = sheetList.split(/\n/);
                logger.debug("sheetList:", sheetList);
                sheetName = sheetName.split("*").join("");
                const sheetIndex = sheetList.findIndex((s: any) => s.includes(sheetName.split("*").join("")));
                const outputFile = path.resolve(`${uploadedFile.replace(".xlsb", "").replace(".xlsx", "")}_${sheetList[sheetIndex].split(" ").join("-")}.csv`);
                //Get the list of files
                const covertCmd = `node ${appConfig.cmdXlsx} -f ${uploadedFile} -N ${sheetIndex} > ${outputFile}`;
                execCreateCsv(covertCmd, outputFile, sheetList[sheetIndex]);

            });
        });
    }



    /**
     * Update total rows using shell script
     * @param {string} file
     * @param {string} fileUploadId
     * @param {string} fileId
     * @param {string} sheetId
     */
    public updateTotalRows(file: string, fileUploadId: string, fileId: string, sheetId: string) {

        const command = `wc -l < ${file}`;

        childProcess.exec(command, (error: any, stdout: any, stderr: any) => {
            if (error) {
                console.log(error.stack);
                console.log(stderr);
            } else {
                if (_.isNumber(+stdout.trim())) {
                    this.updateSheets(fileUploadId, fileId, sheetId, { noOfRows: +stdout.trim() }).then();
                }
            }
        });
    }

    /**
     * Create csv file
     * @param rows
     * @param fileSettingId
     * @param sheetSettingId
     * @param batch
     * @returns {Promise}
     */
    public createImportFile(rows: any, fileSettingId: any, sheetSettingId: any) {

        return new Promise((resolve: any, reject: any) => {
            const csvName = path.resolve(`${appConfig.assets.dataLoad.rawFiles}/${sheetSettingId}.csv`);
            writeToPath(csvName, rows, {
                headers: ColumnOrder,
                delimiter: "\t"
            })
                .on("error", err => reject(err))
                .on("finish", () => {
                    this.updateSheets(this.fileUploadId, fileSettingId, sheetSettingId, {
                        status: "CREATED_CSV"
                    });
                    resolve({
                        file: csvName,
                        fileSettingId: fileSettingId,
                        sheetSettingId: sheetSettingId
                    });
                });
        });
    }

    /**
     * Validate cell value based on panel settings
     * @param fileSettingId
     * @param sheetSettingId
     * @param colConfig
     * @param {string} cellValue
     * @param {number} rowIndex
     * @param {number} colIndex
     * @returns {boolean}
     */
    public validateCellValue(fileSettingId: string, sheetSettingId: string, colConfig: any, cellValue: string, rowIndex: number, colIndex: number) {

        if (_.isNull(cellValue) || cellValue === "") {
            return true;
        }

        let valid = true;
        switch (colConfig.dataType) {
            case "number": {
                if (!isNumeric(cellValue)) {
                    //if (!_.isNumber(cellValue)) {
                    this.validationErrors[sheetSettingId].push({
                        fileUpload: this.fileUploadId,
                        fileSetting: fileSettingId,
                        sheetSetting: sheetSettingId,
                        columnName: colConfig.columnHeader,
                        rowIndex: rowIndex,
                        cellValue: cellValue,
                        message: "Expecting a numeric value",
                    });
                    valid = false;
                }
                break;
            }
            default: {
                break;
            }
        }

        return valid;
    }

    /**
     * Load panel data to database
     * @param {string} csvName
     * @returns {Observable<any>}
     */
    public loadToDb(csvName: string) {
        return new Promise((resolve: any, reject: any) => {

            const command = `mongoimport --host ${appConfig.database.mongoImportHost} --ssl --username ${appConfig.database.username} --password ${appConfig.database.password} --authenticationDatabase admin --db ${appConfig.database.name} --collection marketSales --type TSV --file ${csvName} --headerline`;
            logger.debug("__________________");
            logger.debug(command);
            logger.debug("__________________");

            logger.debug(`loading ${csvName} to db...`);


            exec(command, (err: any, stdout: any) => {
                if (err) {
                    console.error(`exec error: ${err}`);
                    reject(err);
                    return;
                }

                logger.debug(`Done ${csvName} - ${stdout}`);
                resolve(csvName);
            });
        });
    }


    /**
     * Get master column mapping where index will be raw column value
     * @param sheetSetting
     * @param overriddenSettingsIndexed
     * @returns {any}
     */
    public getColumnConfig(sheetSetting: any, overriddenSettingsIndexed: any) {

        const config: any = {
            headerOrPositionColumns: {},
            fillWithColumns: {},
        };

        let columns: any;
        if (overriddenSettingsIndexed[sheetSetting._id]) {
            columns = overriddenSettingsIndexed[sheetSetting._id].mapping;
        } else {
            columns = sheetSetting.columnSetting.mapping;
        }

        columns.forEach((column: any) => {
            const colConfig: any = {
                columnHeader: column.masterColumnId.columnHeader,
                mapType: column.mapType,
                mapTypeValue: column.mapTypeValue,
                matchRule: column.matchRule,
                dataType: column.masterColumnId.dataType
            };

            if (column.mapType == "header" || column.mapType == "position") {
                if (!config.headerOrPositionColumns[column.mapTypeValue]) {
                    config.headerOrPositionColumns[column.mapTypeValue] = [];
                }
                // NOTE: here column map type value is key
                config.headerOrPositionColumns[column.mapTypeValue].push(colConfig);
            } else if (column.mapType == "fillWith") {
                // NOTE: here column header is key
                config.fillWithColumns[column.masterColumnId.columnHeader] = colConfig;
            }
        });


        return config;
    }

    /**
     * Returns file upload settings
     * @param {string} fileUploadId
     * @returns {any}
     */
    public getFileUploadSettings(fileUploadId: string) {
        return FileUpload.findOne({ "_id": fileUploadId })
            .populate({
                path: "files.fileSetting",
                populate: {
                    path: "sheetSettings.columnSetting",
                    populate: {
                        path: "mapping.masterColumnId"
                    }
                },
            })
            .populate("country")
            .populate({
                path: "dataLoadSetting",
            }).lean()
            .populate({
                path: "files.sheets.overriddenColumnSetting",
                populate: {
                    path: "mapping.masterColumnId"
                }
            }).lean()
            .then((uploadInfo: any) => {
                uploadInfo.files.forEach((file: any) => {
                    file.overriddenSettingsIndexed = {};
                    if (file.sheets.length) {
                        file.sheets.forEach((setting: any) => {
                            if (setting.overriddenColumnSetting) {
                                file.overriddenSettingsIndexed[setting.sheetSetting] = setting.overriddenColumnSetting;
                            }
                        });
                    }
                });
                return uploadInfo;
            }).catch();
    }

    /**
     * Update file upload status
     * @param fileUploadId
     * @param status
     * @returns {module:mongoose.Query<any> & {}}
     */
    public fileUploadStatus(fileUploadId: string, status: string) {
        return FileUpload.updateOne({ // find one and 
            _id: fileUploadId
        }, {
            "$set": {
                "status": status as any
            }
        });
    }


    /**
     * Updates file processing status
     * @param {string} status
     * @param {string} fileUploadId
     * @param {string} fileSettingId
     * @returns {module:mongoose.DocumentQuery<FileUploadDocument | null, FileUploadDocument> & {}}
     */
    public updateFileStatus(status: string, fileUploadId: string, fileSettingId: string) {
        return FileUpload.updateOne({
            _id: fileUploadId,
            "files.fileSetting": fileSettingId,
        }, {
            "$set": {
                "files.$.status": status
            }
        });
    }

    /**
     * Update sheet details
     * @param {string} fileUploadId
     * @param {string} fileSettingId
     * @param {string} sheetSettingId
     * @param data
     * @returns {module:mongoose.Query<any> & {}}
     */
    public updateSheets(fileUploadId: string, fileSettingId: string, sheetSettingId: string, data: any) {
        const updateQ: any = {};
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const field = "files.$.sheets.$[sheets].{{field}}".replace("{{field}}", key);
                updateQ[field] = data[key];
            }
        }

        return FileUpload.updateOne({
            _id: fileUploadId,
            "files.fileSetting": fileSettingId,
            "files.sheets.sheetSetting": sheetSettingId,
        },
            {
                "$set": updateQ
            },
            {
                "arrayFilters": [{ "sheets.sheetSetting": sheetSettingId }]
            });

    }


    /**
     * Check whether file exists or not
     * @param {string} file
     * @returns {Promise<boolean>}
     */
    public isFileExist(file: string) {
        try {
            if (fs.existsSync(file)) {
                return true;
            }
        } catch (err) {
            logger.debug(["File not exits", err]);
            console.error(err);
            return false;
        }
    }

    /**
     * Get un processed sheet list
     * @param {string} fileUploadId
     * @returns any
     */
    public getUnProcessedSheets(fileUploadId: string) {
        return FileUpload.find({
            _id: fileUploadId,
            "files.sheets.status": { $in: ["READY", "PROCESSING", "VALIDATION_ERROR", "ERROR"] },
        }).lean();
    }


    /**
     * Check file is ready for db import
     * @param  {any} csvFiles
     */
    public isReadyForDbImport(csvFiles: any) {
        FileUpload.findOne({ _id: this.fileUploadId }).lean()
            // delete marketsales
            .then((data: any) => {
                const isReady = data.files.every((file: any) => file.status === "READY_FOR_DB_IMPORT");
                if (isReady) {
                    logger.debug("READY FOR IMPORT...");
                    // TODO Update all file status to IMPORTED_TO_DB
                    const dbLoadPromises: any = csvFiles.map((csvFile: string) => {
                        return this.loadToDb(csvFile);
                    });

                    const t = moment(new Date());
                    const d1 = moment(this.fileUploadSettings.fileDate);
                    const d2 = moment(this.fileUploadSettings.fileDate).add(1, "days");
                    const fileUploadStatus = (this.firstTimeFileUpload) ? "APPROVED" : "PROCESSED";
                    Promise.all(dbLoadPromises).then((result: any) => {
                        // Override file condition
                        return FileUpload.find({
                            dataLoadSetting: this.fileUploadSettings.dataLoadSetting._id as any,
                            fileDate: {
                                "$gte": new Date(+d1.format("YYYY"), +d1.format("M") - 1, +d1.format("D")),
                                "$lt": new Date(+d2.format("YYYY"), +d2.format("M") - 1, +d2.format("D"))
                            }
                        }).sort({ "createdAt": -1 }).then((response: any) => {
                            if (response.length > 1) {
                                FileUpload.findOneAndRemove({ "_id": response[1]._id }).then((res: any) => {
                                    MarketSale.remove({ fileUploadId: response[1]._id }).then();
                                    return this.fileUploadStatus(this.fileUploadId, fileUploadStatus);
                            }).then(()=>{
                                 // archive the files here

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
                        
                                  this.fileUploadSettings.files.forEach((eachFile: any) => {
                                    console.log(eachFile.fileName);
                                    archive(eachFile.fileName,this.fileUploadSettings);
                                    eachFile.fileSetting.sheetSettings.forEach((eachSheet) => {
                                        console.log(eachFile.fileName.replace(".xlsx","")+"_"+eachSheet.sheetName.concat(".csv"));
                                        console.log(eachSheet._id.toString().concat(".csv"));
                        
                                       archive(eachSheet._id.toString().concat(".csv"),this.fileUploadSettings);
                                        archive(eachFile.fileName.replace(".xlsx","")+"_"+eachSheet.sheetName.concat(".csv"),this.fileUploadSettings);
                                    });});
                                  
                        
                                 console.log("archive the files here",this.fileUploadSettings);
                                });}else {
                                   return this.fileUploadStatus(this.fileUploadId, fileUploadStatus);
                                }

                            }).catch((e) => {
                                console.log(e);
                            });
                    }).then(() => {
                        logger.debug("Time take for db import:", moment(new Date()).diff(t));
                        // TODO Update all file status to IMPORTED_TO_DB
                        this.subscriber.complete();
                    });
                }
            });
    }




    /**
     * Add a cell value to cellValues object
     * @param cellValues - all the column values of
     * @param rowIndex
     * @param colPosition
     * @param cellValue
     * @param configs - column setting mapping rule
     * @param matchRules - list of match rules to be applied to cellValue later
     * @param sheetSetting
     * @param fileSetting
     */
    public addToCellValues(cellValues: any, rowIndex: number, colPosition: number, cellValue: any, configs: any, matchRules: any, sheetSetting: any, fileSetting: any) {

        configs.forEach((config: any) => {
            // add match rules
            if (config.matchRule !== "") {
                matchRules[config.columnHeader] = config.matchRule;
            }

            if (config.dataType === "number") {
                cellValue = this.applyInputThousandSeparatorRule(cellValue, config, sheetSetting);
                cellValue = this.applyDecimalSeparatorRule(cellValue, config, sheetSetting);

                // Replace all characters other than number
                if (cellValue) {
                    cellValue = cellValue.replace(/[^0-9.]/g, "");
                }

                if (isNumeric(cellValue)) {
                    cellValue = +cellValue;
                }

                if (!cellValue) {
                    cellValue = 0;
                }
            }

            if (this.validateCellValue(fileSetting.fileSetting._id, sheetSetting._id, config, cellValue, rowIndex, colPosition)) {
                if (sheetSetting.multiplier !== undefined && sheetSetting.multiplier && sheetSetting.multiplier !== ""
                    && config.columnHeader.length === 4
                    && ["LC", "RX", "UN"].indexOf(config.columnHeader.substring(0, 2)) !== -1) {
                    cellValue = cellValue * sheetSetting.multiplier;
                }
                cellValues[this.columnOrderIndexed[config.columnHeader]] = cellValue;
            }
        });

    }


    public applyMatchRule(cellValues: any, matchRules: any) {
        const cellValuesCopy = JSON.parse(JSON.stringify(cellValues));
        for (const colName in matchRules) {
            if (matchRules.hasOwnProperty(colName)) {
                const rules = matchRules[colName].split(",");
                rules.forEach((rule: string) => {
                    if (rule.indexOf("=") > -1) {
                        const [replace, replaceRule] = rule.split(":");
                        const [mapColumn, match] = replaceRule.split("=");
                        if (cellValuesCopy[this.columnOrderIndexed[mapColumn]] === match) {
                            cellValues[this.columnOrderIndexed[colName]] = replace;
                        }
                    } else {
                        const [replace, match] = rule.split(":");
                        if (cellValuesCopy[this.columnOrderIndexed[colName]] === match) {
                            cellValues[this.columnOrderIndexed[colName]] = replace;
                        }
                    }
                });
            }
        }
    }


    public handleMoleculeDuplicates(moleculeDuplicates: any, cellValues: any, rows: any) {
        //Change + to !
        cellValues[this.columnOrderIndexed.Molecules] = this.cleanTheMolecule(cellValues[this.columnOrderIndexed.Molecules]);
        const cellValuesCopy = JSON.parse(JSON.stringify(cellValues));
        cellValuesCopy[this.columnOrderIndexed.Molecules] = "";
        const hash = md5(cellValuesCopy.join(""));

        const duplicatedRowIndex = moleculeDuplicates[hash];
        // Undefined check is mandatory
        if (typeof duplicatedRowIndex === "undefined") {
            moleculeDuplicates[hash] = rows.length;
            rows.push(cellValues);
        } else {
            rows[duplicatedRowIndex][this.columnOrderIndexed.Molecules] = rows[duplicatedRowIndex][this.columnOrderIndexed.Molecules] + "!" + cellValues[this.columnOrderIndexed.Molecules];
        }
    }

    /**
     * Removing the special characters
     * @param cleaningMolecule
     */
    public cleanTheMolecule = (molecules) => {
        molecules = molecules.toString().replace(/,+\/n/g, "!").split("\n").join("!");
        const replaceCharacters = [" + ", "+", " / ", "/", " \\ ", "\\", " * ", "*", " , ", ",", " AND ", " ET ", " IN ", " : ", ":"];
        replaceCharacters.forEach((c) => {
            if (molecules.includes(c))
                molecules = molecules.split(c).join("!");
        });
        return molecules;
    }

    public addFillWithValues(columnConfig: any, cellValues: any, fileSetting: any, sheetSetting: any, matchRules: any) {
        Object.keys(columnConfig.fillWithColumns).forEach((key: any) => {
            const fillWith = columnConfig.fillWithColumns[key];
            if (fillWith.matchRule !== "") {
                matchRules[fillWith.columnHeader] = fillWith.matchRule;
            }
            if (this.validateCellValue(fileSetting.fileSetting._id, sheetSetting._id, fillWith, fillWith.mapTypeValue, -1, -1)) {
                cellValues[this.columnOrderIndexed[fillWith.columnHeader]] = fillWith.mapTypeValue;
            }
        });
    }


    public applyInputThousandSeparatorRule(cellValue: any, config: any, sheetSetting: any) {
        if (cellValue && cellValue !== undefined && config.dataType === "number" && sheetSetting.inputThousandSeparator) {
            switch (sheetSetting.inputThousandSeparator.toLowerCase()) {
                case "space": {
                    cellValue = cellValue.toString().replace(/\s/g, "");
                    break;
                }
                case "comma": {
                    cellValue = cellValue.toString().replace(/,/g, "");
                    break;
                }
            }
        }

        return cellValue;
    }


    public applyDecimalSeparatorRule(cellValue: any, config: any, sheetSetting: any) {
        if (cellValue && cellValue !== undefined && config.dataType === "number" && sheetSetting.decimalSeparator) {
            switch (sheetSetting.decimalSeparator.toLowerCase()) {
                case "space": {
                    cellValue = cellValue.toString().replace(/\s/g, ".");
                    break;
                }
                case "comma": {
                    cellValue = cellValue.toString().replace(/,/g, ".");
                    break;
                }
            }
        }

        return cellValue;
    }


    /**
     * Finalize process file
     * @param  {any} params
     */
    public finalizeProcessFile(params: any) {
        const { resolve, batch, rows, sheetSetting, fileSetting } = params;

        if (this.validationErrors[sheetSetting._id].length) {
            this.subscriber.next({
                message: "VALIDATION_ERROR",
                data: {
                    sheetSettingId: sheetSetting._id,
                    errors: this.validationErrors[sheetSetting._id]
                }
            });

            this.updateSheets(this.fileUploadId, fileSetting.fileSetting._id, sheetSetting._id, {
                status: "VALIDATION_ERROR"
            }).then(() => {
                FileUploadError.create(this.validationErrors[sheetSetting._id]).then();
                resolve([rows, "VALIDATION_ERROR"]);
            });
        } else {

            this.subscriber.next({
                message: "SHEET_COMPLETED",
                data: {
                    sheetSettingId: sheetSetting._id
                }
            });
            this.updateSheets(this.fileUploadId, fileSetting.fileSetting._id, sheetSetting._id, {
                status: "PROCESSED",
                batch: batch
            }).then(() => {
                resolve([rows, "PROCESSED"]);
            });
        }
    }

    public beforeProcessRow(params: any) {
        let noOfColumns, sheet;
        const { fileType, fileSetting, sheetSetting, overriddenSettingsIndexed, file } = params;

        this.updateSheets(this.fileUploadId, fileSetting.fileSetting._id, sheetSetting._id, { status: "PROCESSING" }).then();
        if (!this.isFileExist(file)) {
            this.updateSheets(this.fileUploadId, fileSetting.fileSetting._id, sheetSetting._id, {
                status: "ERROR",
                msg: `File ${file} not exists`
            }).then(() => {
                throw new Error(`File ${file} not exists`);
            });
        }

        const columnConfig: any = this.getColumnConfig(sheetSetting, overriddenSettingsIndexed);
        if (!Object.keys(columnConfig.headerOrPositionColumns).length
            && !Object.keys(columnConfig.fillWithColumns).length) {
            const msg = "NO mapping found.";
            this.updateSheets(this.fileUploadId, fileSetting.fileSetting._id, sheetSetting._id, {
                status: "ERROR",
                msg: msg
            }).then(() => {
                throw new Error(msg);
            });
        }

        this.updateTotalRows(file, this.fileUploadId, fileSetting.fileSetting._id, sheetSetting._id);
        this.validationErrors[sheetSetting._id] = [];
        this.batch = 1;

        this.updateSheets(this.fileUploadId, fileSetting.fileSetting._id, sheetSetting._id, {
            batch: this.batch
        }).then();

        return {
            file,
            columnConfig,
            sheet,
            noOfColumns,
            columnHeaderStartPosition: sheetSetting.columnHeaderStartPosition - 1,
            dataRowStartPosition: sheetSetting.dataRowStartPosition - 1,
            rows: [],
            moleculeDuplicates: {},
            matchRules: {}
        };
    }


    public processRow(params: any) {
        const {
            fileType,
            sheet,
            noOfColumns,
            rowIndex,
            columnHeaderStartPosition,
            dataRowStartPosition,
            fileSetting,
            sheetSetting,
            columnConfig,
            matchRules,
            moleculeDuplicates,
            rows,
            rowValues,
        } = params;


        if (rowIndex % 1000 == 0) {
            this.batch++;
            this.updateSheets(this.fileUploadId, fileSetting.fileSetting._id, sheetSetting._id, { batch: this.batch }).then();
        }

        const cellValues: any = [];

        let cellValue: any;
        for (let colIndex = 0; colIndex <= noOfColumns; colIndex++) {

            switch (fileType) {
                case "xlsx": {
                    const cell = sheet[XLSX.utils.encode_cell({ r: rowIndex, c: colIndex })];
                    cellValue = (cell !== undefined) ? cell.v : null;
                    break;
                }

                case "csv": {
                    cellValue = rowValues[colIndex];
                    break;
                }
            }

            // Columns configuration is starting in position 1
            const colPosition = colIndex + 1;

            // Apply empty value rule
            const emptyValueIdentifierChar = this.emptyValueIdentifierMap[sheetSetting.emptyValueIdentifier] || sheetSetting.emptyValueIdentifier;
            if (sheetSetting.emptyValueIdentifier && cellValue) {
                if (cellValue.toString().trim() === emptyValueIdentifierChar) {
                    cellValue = 0;
                }
            }

            const configs = (columnConfig.headerOrPositionColumns[colPosition] === undefined)
                ? columnConfig.headerOrPositionColumns[ColumnOrder[colPosition]] // by raw column header
                : columnConfig.headerOrPositionColumns[colPosition]; // by raw column position

            // Skip the column if you don't have configuration
            if (configs === undefined) {
                continue;
            }

            // Skipping validation for getting column headers from file
            if (rowIndex === columnHeaderStartPosition) {
                configs.forEach((config: any) => {
                    // add match rules
                    if (config.matchRule !== "") {
                        matchRules[config.columnHeader] = config.matchRule;
                    }

                    cellValues[this.columnOrderIndexed[config.columnHeader]] = cellValue;
                });
            } else if (rowIndex >= dataRowStartPosition) {
                this.addToCellValues(cellValues, rowIndex, colPosition, cellValue, configs, matchRules, sheetSetting, fileSetting);
            }
        }


        if (cellValues.join("") !== "" && cellValues.length) {
            this.addFillWithValues(columnConfig, cellValues, fileSetting, sheetSetting, matchRules);
            this.applyMatchRule(cellValues, matchRules);

            cellValues[this.columnOrderIndexed["fileUploadId"]] = this.fileUploadSettings._id;
            cellValues[this.columnOrderIndexed["fileSetting"]] = fileSetting._id;
            cellValues[this.columnOrderIndexed["sheetSetting"]] = sheetSetting._id;

            if (rowIndex > columnHeaderStartPosition) {
                //if (sheetSetting.removeMoleculeDuplicates) {
                this.handleMoleculeDuplicates(moleculeDuplicates, cellValues, rows);
                // } else {
                //     rows.push(cellValues);
                // }
            }
        }
    }
}