import mongoose, { Schema } from "mongoose";
import {ColumnSetting} from "./ColumnSetting";

export enum Delimiter {
    Space = "space",
    Comma = "comma",
    Colon = "colon",
    semiColon = "semin-colon",
    none = "none",
}

export type SheetSettingDocument = mongoose.Document & {
    columnSetting: { type: Schema.Types.ObjectId; ref: "ColumnSetting" };
    sheetName: string;
    columnHeaderStartPosition: number;
    dataRowStartPosition: number;
    removeMoleculeDuplicates: boolean;
    numberOfMonths: number;
    multiplier: number;
    inputThousandSeparator: string; //['NONE', 'COMMA', 'SPACE', 'DOT'],
    decimalSeparator: string; //[DOT, SPACE],
    emptyValueIdentifier: string;
    delimiter: {
        type: string;
        enum: [
            Delimiter.none,
            Delimiter.semiColon,
            Delimiter.Colon,
            Delimiter.Comma,
            Delimiter.Space,
            ];
        default: Delimiter.none;
    };
};

export const sheetSettingSchema = new mongoose.Schema(
    {
        columnSetting: { type: Schema.Types.ObjectId, ref: ColumnSetting },
        numberOfMonths: Number,
        inputThousandSeparator: String, //['NONE', 'COMMA', 'SPACE', 'DOT'],
        decimalSeparator: String, //[DOT, SPACE],
        columnHeaderStartPosition: Number,
        dataRowStartPosition: Number,
        sheetName: String,
        multiplier:Number,
        removeMoleculeDuplicates:Boolean,
        emptyValueIdentifier:String,
        delimiter: {
            type: String,
            enum: [
                Delimiter.none,
                Delimiter.semiColon,
                Delimiter.Colon,
                Delimiter.Comma,
                Delimiter.Space,
            ],
            default: Delimiter.none,
        },

    },
    { timestamps: true, collection: "sheetSettings" }
);

export const SheetSetting = mongoose.model<SheetSettingDocument>("SheetSetting", sheetSettingSchema);
