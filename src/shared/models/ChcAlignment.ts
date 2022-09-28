import mongoose from "mongoose";

export type ChcAlignmentDocument = mongoose.Document & {
    megaCategory: string;
    category: string;
    atc4Description: string;
    atc4: string;
    rx: string;
    otc: string;
    gi: string;
    na: string;
    unknown: string;
    unspec: string;
    includeRx: string;
    country: string;
    createdAt: Date;
    updatedAt: Date;
};

const chcAlignmentSchema = new mongoose.Schema({
    megaCategory:String,
    category:String,
    atc4Description:String,
    atc4 :String,
    rx:String,
    otc:String,
    gi: String,
    na: String,
    unknown: String,
    unspec: String,
    includeRx:String,
    country:String,
    name: String,
    code: String,
}, { timestamps: true , collection: "chcAlignment"});

export const ChcAlignment = mongoose.model<ChcAlignmentDocument>("ChcAlignment", chcAlignmentSchema);