import { Observable } from "rxjs";
import path from "path";
import { appConfig } from "../../../appConfig";

const XLSX = require("xlsx");

/**
 * XLSX file preview
 */
export default class CsvFilePreview {

    /**
     * Create xlsx file preview
     * @param {any} file
     * @returns {Observable<any>}
     */
    public create(file: any) {
        return new Observable((subscriber: any) => {
            file.preview = {
                status: "PREVIEW_READY",
                data: []
            };
            const filename = `${path.resolve(appConfig.assets.dataLoad.rawFiles)}/${file.filename}`;
            const workbook = XLSX.readFile(filename, { sheetRows: 50 });

            const csvData: Array<any> = [];
            workbook.SheetNames.forEach((sheetName: string, index: number) => {
                csvData.push({
                    sheetName: sheetName,
                    rows: XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, defval: null })
                });
            });

            file.preview.status = "PREVIEW_READY";
            file.preview.data = csvData;
            subscriber.next({ file });
            subscriber.complete();
        });

    }
}

