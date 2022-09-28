import mongoose, { Schema } from "mongoose";
import { DataLoadSetting } from "./DataLoadSetting";
import { FileSetting } from "./FileSetting";
import { User } from "./User";

// TODO: Later move overridden settings to sheet details
export type SheetsDocument = mongoose.Document & {
    sheetSetting: { type: Schema.Types.ObjectId; ref: "SheetSetting" };
    overriddenColumnSetting: { type: Schema.Types.ObjectId; ref: "ColumnSetting" };
    noOfRows: Schema.Types.Number;
    noOfRowsProcessed: Schema.Types.Number;
    
    status: {
        type: Schema.Types.String;
        enum: ["READY", "PROCESSING", "PROCESSED", "CREATING_CSV", "CREATED_CSV", "VALIDATION_ERROR"];
        default: "READY";
    };
    batch: Schema.Types.Number;
};

const SheetsSchema = new mongoose.Schema({
    sheetSetting: { type: Schema.Types.ObjectId, ref: "SheetSetting" },
    overriddenColumnSetting: { type: Schema.Types.ObjectId, ref: "ColumnSetting" },
    noOfRows: Schema.Types.Number,
    noOfRowsProcessed: Schema.Types.Number,
    status: {
        type: Schema.Types.String,
        enum: ["READY", "PROCESSING", "PROCESSED", "CREATING_CSV", "CREATED_CSV", "VALIDATION_ERROR"],
        default: "READY",
    },
    batch: Schema.Types.Number
});

export type FileSubDocument = mongoose.Document & {
    fileSetting: { type: Schema.Types.ObjectId; ref: "FileSetting" };
    
    fileName: string;
    originalName: string;
    sheets: [SheetsDocument];
    fileSize: number;
    status: {
        type: Schema.Types.String;
        enum: ["READY", "PROCESSING", "READY_FOR_DB_IMPORT", "IMPORTING_TO_DB", "IMPORTED_TO_DB", "ERROR"];
        default: "READY";
    };
    batch: number;
};


const FileSchema = new mongoose.Schema({
    fileSetting: { type: Schema.Types.ObjectId, ref: FileSetting },
    
    fileName: Schema.Types.String,
    originalName: Schema.Types.String,
    sheets: [SheetsSchema],
    fileSize: Schema.Types.String,
    status: {
        type: Schema.Types.String,
        enum: ["READY", "PROCESSING", "READY_FOR_DB_IMPORT", "IMPORTING_TO_DB", "IMPORTED_TO_DB", "ERROR"],
        default: "READY",
    },
    batch: Schema.Types.Number,
});


export type FileUploadDocument = mongoose.Document & {
    country: { type: Schema.Types.ObjectId; ref: "Country" };
    dataLoadSetting: { type: Schema.Types.ObjectId; ref: "DataLoadSetting" };
    uploadedBy: { type: Schema.Types.ObjectId; ref: "User" };
    currentTotalMarketSales: Schema.Types.Number;
    previousTotalMarketSales: Schema.Types.Number;
    growth: Schema.Types.Number;
    fileDate: Date; //(set to the beginning of the month, 1/1/2019, 1/2/2019)
    fileDelayReason: Schema.Types.String;
    fileDateOffset: Schema.Types.Number;
    files: [FileSubDocument];
    status: {
        type: Schema.Types.String;
        enum: ["READY", "PROCESSING", "PROCESSED", "REJECTED", "APPROVED", "ERROR"];
        default: "READY";
    };
    batch: number; // Can be used to resume the process
};


const fileUploadSchema = new mongoose.Schema({
        country: { type: Schema.Types.ObjectId, ref: "Country" },
        dataLoadSetting: { type: Schema.Types.ObjectId, ref: DataLoadSetting },
        uploadedBy: { type: Schema.Types.ObjectId, ref: User },
        currentTotalMarketSales:Schema.Types.Number,
        previousTotalMarketSales:Schema.Types.Number,
        growth:Schema.Types.Number,
        fileDate: Schema.Types.Date, //(set to the beginning of the month, 1/1/2019, 1/2/2019),
        fileDelayReason:Schema.Types.String,
        fileDateOffset: Schema.Types.Number,
        files: [FileSchema],
        originalName: Schema.Types.String,
        status: {
            type: Schema.Types.String,
            enum: ["READY", "PROCESSING", "PROCESSED", "REJECTED", "APPROVED", "ERROR"],
            default: "READY",
        },
        batch: Schema.Types.Number // Can be used to resume the process


    }, { timestamps: true, collection: "fileUploads" }
);

export const FileUpload = mongoose.model<FileUploadDocument>("FileUpload", fileUploadSchema);
