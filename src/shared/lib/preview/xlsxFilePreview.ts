import { Observable } from "rxjs";
import path from "path";
import { appConfig } from "../../../appConfig";

const XLSX = require("xlsx");

/**
 * XLSX file preview
 */
export default class XlsxFilePreview {

    /**
     * Create xlsx file preview
     * @param {any} file
     * @returns {Observable<any>}
     */
    public create(file: any): Observable<any> {
        return new Observable((subscriber: any) => {
            file.preview = {
                status: "PREVIEW_READY",
                data: []
            };

            const filename = `${path.resolve(appConfig.assets.dataLoad.rawFiles)}/${file.filename}`;
            const workbook = XLSX.readFile(filename, { sheetRows: 50 });

            const excelData: Array<any> = [];
            workbook.SheetNames.forEach((sheetName: string, index: number) => {
                try {
                    const range = XLSX.utils.decode_range(workbook.Sheets[sheetName]["!ref"]);
                    excelData.push({
                        sheetName: sheetName,
                        rows: XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, defval: null }),
                        totalRows: range.s.r
                    });
                } catch(e) {
                    console.log("XlsxFilePreview >>", e);
                }
            });

            file.preview.data = excelData;
            subscriber.next({ file });
            subscriber.complete();
        });
    }
}

