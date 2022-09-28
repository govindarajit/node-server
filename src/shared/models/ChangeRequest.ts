import mongoose, { Schema } from "mongoose";

export type chcChangeRequest = mongoose.Document & {
    
    userId: { type: Schema.Types.ObjectId; ref: "User" };
    country: string;
    megaCategory: string;
    category: string;
    atc4Description: string;
    comment: string;
    status: string;
    reason: string;
    createdAt: Date;
    updatedAt: Date;
};

const chcChangeRequestSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    country:String,
    megaCategory:String,
    category:String,
    atc4Description:String,
    comment:String,
    status:String,
    reason:String,
    createdAt: Date,
    updatedAt: Date,
}, { timestamps: true , collection: "chcChangeRequest"});

export const ChangeRequest = mongoose.model<chcChangeRequest>("ChangeRequest", chcChangeRequestSchema);