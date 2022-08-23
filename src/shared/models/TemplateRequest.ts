import mongoose, { Schema } from "mongoose";

export type templateRequest = mongoose.Document & {
    
    userId: { type: Schema.Types.ObjectId; ref: "User" };
    templateName: string;
    country: string;
    fileName: string;
    entrantName: string;
    createdAt: Date;
    updatedAt: Date;
};

const templateRequestSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    templateName: String,
    country: String,
    fileName: String,
    entrantName: { type: Schema.Types.ObjectId, ref: "Email" },
    createdAt: Date,
    updatedAt: Date,
}, { timestamps: true , collection: "templateRequest"});

export const ChangeRequest = mongoose.model<templateRequest>("ChangeRequest", templateRequestSchema);