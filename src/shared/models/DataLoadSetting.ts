import mongoose, { Schema } from "mongoose";
import { Country } from "./Country";

export enum DataType {
    MarketSales = "MarketSales",
    FinancialData = "FinancialData",
    Forecast = "Forecast"
}

export type DataLoadSettingDocument = mongoose.Document & {
    countryId: { type: Schema.Types.ObjectId; ref: "Country" };
    settingName: string;
    dataType: {
        type: string;
        enum: [DataType.MarketSales, DataType.FinancialData, DataType.Forecast];
        default: DataType.MarketSales;
    };
    numberOfDataFiles: number;
    inputFileFrequency: string; // [ Monthly, Weekly ],
    fileExpectedDate: Date;
    inputFileType: string; //(csv, xlsx, txt etc)
    outputFileName: string; // standard filename
    outputFileType: string; // (csv, xlsx, txt etc),
    numberOfInputFiles: number;
    createdAt: Date;
    updatedAt: Date;
}; 

const dataLoadSettingSchema = new mongoose.Schema(
    {
        countryId: { type: Schema.Types.ObjectId, ref: Country },
        settingName: Schema.Types.String,
        dataType: {
            type: Schema.Types.String,
            enum: [DataType.MarketSales, DataType.FinancialData, DataType.Forecast],
            default: DataType.MarketSales,
        },
        numberOfDataFiles:Schema.Types.Number,
        inputFileFrequency: Schema.Types.String,
        fileExpectedDate: Schema.Types.Date,
        inputFileType: Schema.Types.String,
        outputFileName: Schema.Types.String,
        outputFileType: Schema.Types.String,
        numberOfInputFiles: Schema.Types.Number
    }, { timestamps: true, collection: "dataLoadSettings" }
);

export const DataLoadSetting = mongoose.model<DataLoadSettingDocument>("DataLoadSetting", dataLoadSettingSchema);



