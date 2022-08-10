import mongoose, { Schema } from "mongoose";
import { FileUpload } from "./FileUpload";

export type FileUploadErrorDocument = mongoose.Document & {
    fileUpload: { type: Schema.Types.ObjectId; ref: "FileUpload" };
    fileSetting: { type: Schema.Types.ObjectId; ref: "FileSetting" };
    sheetSetting: { type: Schema.Types.ObjectId; ref: "SheetSetting" };
    rowIndex: number;
    columnName: string;
    cellValue: string;
    message: string;
};

const FileUploadErrorSchema = new mongoose.Schema({
    fileUpload: { type: Schema.Types.ObjectId, ref: "FileUpload" },
    fileSetting: { type: Schema.Types.ObjectId, ref: "FileSetting" },
    sheetSetting: { type: Schema.Types.ObjectId, ref: "SheetSetting" },
    rowIndex: Schema.Types.Number,
    columnName: Schema.Types.String,
    cellValue: Schema.Types.String,
    message: Schema.Types.String,
}, { timestamps: true, collection: "fileUploadErrors" });

export const FileUploadError = mongoose.model<FileUploadErrorDocument>("FileUploadError", FileUploadErrorSchema);
