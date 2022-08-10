import XlsxFilePreview from "./xlsxFilePreview";
import CsvFilePreview from "./csvFilePreview";
import { Observable } from "rxjs/internal/Observable";

export default class FilePreview {
    static create(files: Array<any>): Observable<any> {
        return new Observable((subscriber: any) => {
            files.forEach((file: any) => {
                const extension = file.filename.split(".")[1];
                switch (extension.toLowerCase()) {
                    case "xlsx":
                    case "xlsb": {
                        const xlsxPreview = new XlsxFilePreview();
                        xlsxPreview.create(file).subscribe((file: any) => {
                            subscriber.next(file);
                        });
                        break;
                    }
                    case "csv": {
                        const csvPreview = new CsvFilePreview();
                        csvPreview.create(file).subscribe((file: any) => {
                            subscriber.next(file);
                        });
                        break;
                    }
                }
            });
        });
    }
}
