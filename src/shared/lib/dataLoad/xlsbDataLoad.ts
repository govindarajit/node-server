import path from "path";
import { appConfig } from "./../../../appConfig";
import * as childProcess from "child_process";
import DataLoad from "./dataLoad";
import { Observable } from "rxjs";

export default class XlsbDataLoad extends DataLoad {


    constructor() {
        super();
    }

    public import(data: any) {
        this.fileUploadId = data.fileUploadId;
        return new Observable((subscriber: any) => {
            this.subscriber = subscriber;
            this.getFileUploadSettings(this.fileUploadId).then((settings: any) => {
                this.fileUploadSettings = settings;
                this.firstTimeFileUpload = data.firstTimeFileUpload;
                this.fileUploadStatus(this.fileUploadId, "PROCESSING").then();
                const convetFiles = settings.files.map((file: any) => {
                    return this.convertToCsv(file);
                });
            });
        }
        );
    }



    convertToCsv(file: any) {

        return new Promise((resolve: any, reject: any) => {
            const uploadedFile = `${appConfig.root}/${appConfig.assets.dataLoad.rawFiles}/${file.fileName}`;
            const sheetNames = file.fileSetting.sheetSettings.map((setting: any) => setting.sheetName);
            const sheetListCmd = `node ${appConfig.cmdXlsx} --list-sheets ${uploadedFile}`;

            const convertedFiles = [];
            childProcess.exec(sheetListCmd, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
                if (stdout.trim()) {
                    const sheetList = stdout.trim().split(/\n/);

                    sheetList.map((sheet: string) => {
                        
                        if (sheetNames.includes(sheet)) {
                            const outputFile = `${uploadedFile.replace(".xlsb", "")}_${sheet}.csv`;
                            const covertCmd = `node ${appConfig.cmdXlsx} -f ${uploadedFile} -s ${sheet} > ${outputFile}`;
                            childProcess.exec(covertCmd, (error, out, err) => {
                                if (error) {
                                    console.error(`exec error: ${error}`);
                                } else if (err) {
                                    console.error("err:",err);
                                    resolve(false);
                                } else {
                                    convertedFiles.push(sheet);
                                    if (convertedFiles.length === sheetNames.length) {
                                        resolve(true);
                                    }
                                }
                            });
                        }
                    });


                }
            });

        });
    }
}
