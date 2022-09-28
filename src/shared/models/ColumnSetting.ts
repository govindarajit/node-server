import mongoose, { Schema } from "mongoose";
import { MasterColumn } from "./MasterColumn";

export type ColumnSettingDocument = mongoose.Document & {
    sheetSettingId: { type: Schema.Types.ObjectId; ref: "SheetSetting" };
    settingType: {
        type: string;
        enum: ["MASTER_SETTING", "OVERRIDDEN_SETTING"];
        default: "MASTER_SETTING";
    };
    unstart: number;
    rxstart: number;
    lcstart: number;
    unDirection: string;
    rxDirection: string;
    lcDirection: string;
    mapping: [{
        masterColumnId: { type: Schema.Types.ObjectId; ref: "MasterColumn" };
        mapType: {
            type: string;
            enum: ["header", "position", "fillWith", "fileName"];
            default: "header";
        };
        mapTypeValue: string;
        matchRule: string; // Free text config, eg: ABC:PANEL1, XYZ:PANEL2
    }];
};

export const columnSettingSchemaDefinition = {
    sheetSetting: { type: Schema.Types.ObjectId, ref: "SheetSetting" },
    settingType:
        {
            type: Schema.Types.String,
            enum: ["MASTER_SETTING", "OVERRIDDEN_SETTING"],
            default: "MASTER_SETTING",
        },
    unStart:Number,
    rxStart:Number,
    lcStart:Number,
    unDirection:String,
    rxDirection:String,
    lcDirection:String,
    mapping: [{
        masterColumnId: { type: Schema.Types.ObjectId, ref: MasterColumn },
        mapType: {
            type: Schema.Types.String,
            enum: ["header", "position", "fillWith", "fileName"],
            default: "header"
        },
        mapTypeValue: Schema.Types.String,
        matchRule: Schema.Types.String, // Free text config, eg: ABC:PANEL1, XYZ:PANEL2
    }],



};

const columnSettingSchema = new mongoose.Schema(columnSettingSchemaDefinition, {
    timestamps: true,
    collection: "columnSettings"
});

export const ColumnSetting = mongoose.model<ColumnSettingDocument>("ColumnSetting", columnSettingSchema);
