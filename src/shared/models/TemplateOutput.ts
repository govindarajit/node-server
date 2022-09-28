import mongoose, { Schema } from "mongoose";

export type templateOutputRequest = mongoose.Document & {
    outputDetails:[
        {
         fileName: String,
         table:[
             {
                 tableName:String,
                 rows:[
                     {
                         colName: String,
                         datatype: String,
                         mandatory: Boolean,
                     }
                 ]
             }
         ]
        }
],
        createdAt: Date,
        updatedAt: Date,
    };

const templateOutputRequestSchema = new mongoose.Schema({
    outputDetails:[
        {
         fileName: String,
         table:[
             {
                 tableName:String,
                 rows:[
                     {
                         colName: String,
                         datatype: String,
                         mandatory: Boolean,
                     }
                 ]
             }
         ]
        }
],
    createdAt: Date,
    updatedAt: Date,
}, { timestamps: true , collection: "templateOutputRequest"});

export const ChangeOutputTemplateRequest = mongoose.model<templateOutputRequest>("ChangeOutputTemplateRequest", templateOutputRequestSchema);