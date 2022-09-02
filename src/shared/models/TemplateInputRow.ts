import mongoose, { Schema } from "mongoose";

export type templateInputRowRequest = mongoose.Document & {
     tableId:{ type: Schema.Types.ObjectId, ref: "ChangeInputTableTemplateRequest" },
     colName: String,
     datatype: String,
     mandatory: Boolean,
     format: String,
     inputingValues: String,
     values: String,
     regex: Boolean,
     fullMatch: Boolean,
     ignoreCase: Boolean,
    };

const templateInputRowRequestSchema = new mongoose.Schema({
    tableId:{ type: Schema.Types.ObjectId, ref: "ChangeInputTableTemplateRequest" },
    colName: String,
    datatype: String,
    mandatory: Boolean,
    format: String,
    inputingValues: String,
    values: String,
    regex: Boolean,
    fullMatch: Boolean,
    ignoreCase: Boolean,
   }, { timestamps: true , collection: "templateInputRowRequest"});

export const ChangeInputRowTemplateRequest = mongoose.model<templateInputRowRequest>("ChangeInputRowTemplateRequest", templateInputRowRequestSchema);