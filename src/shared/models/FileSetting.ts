import mongoose, { Schema } from "mongoose";
import { DataLoadSetting } from "./DataLoadSetting";
import {sheetSettingSchema,SheetSettingDocument} from "./SheetSetting";

export type FileSettingDocument = mongoose.Document & {
    dataLoadSetting: { type: Schema.Types.ObjectId; ref: "DataLoadSetting" };
    fileName: string;
    noOfSheets: number;
    sheetSettings: [SheetSettingDocument];
};

const fileSettingSchema = new mongoose.Schema({
    dataLoadSetting: { type: Schema.Types.ObjectId, ref: DataLoadSetting },
    fileName: Schema.Types.String,
    noOfSheets: Schema.Types.Number,
    sheetSettings:[sheetSettingSchema],
},{ timestamps: true, collection: "fileSettings" });

export const FileSetting = mongoose.model<FileSettingDocument>("FileSetting", fileSettingSchema);
