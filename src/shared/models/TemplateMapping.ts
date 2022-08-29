import mongoose, { Schema } from "mongoose";

export type templateMappingRequest = mongoose.Document & {
    relationMapping:[
        {
            start: String,
            end: String
        }
    ],
        createdAt: Date,
        updatedAt: Date,
    };

const templateMappingRequestSchema = new mongoose.Schema({
    relationMapping:[
        {
            start: String,
            end: String
        }
    ],
    createdAt: Date,
    updatedAt: Date,
}, { timestamps: true , collection: "templateMappingRequest"});

export const ChangeMappingTemplateRequest = mongoose.model<templateMappingRequest>("ChangeMappingTemplateRequest", templateMappingRequestSchema);