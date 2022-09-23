import mongoose, { Schema } from "mongoose";

export type templateMappingRequest = mongoose.Document & {
    relationMapping: [
        {
            start: String;
            end: String;
            workbook: Number;
            table: Number;
            row: Number;
        }
    ];
    createdAt: Date;
    updatedAt: Date;
};

const templateMappingRequestSchema = new mongoose.Schema(
    {
        relationMapping: [
            {
                start: String,
                end: String,
                workbook: Number,
                table: Number,
                row: Number
            }
        ],
        createdAt: Date,
        updatedAt: Date
    },
    { timestamps: true, collection: "templateMappingRequest" }
);

export const ChangeMappingTemplateRequest = mongoose.model<templateMappingRequest>("ChangeMappingTemplateRequest", templateMappingRequestSchema);
