import mongoose from "mongoose";

export type MasterColumnDocument = mongoose.Document & {
    columnHeader: string;
    dataType: string;
};

const MasterColumnSchema = new mongoose.Schema({
    columnHeader: String,
    dataType: String,
}, { timestamps: true, collection: "masterColumns" });


export const MasterColumn = mongoose.model<MasterColumnDocument>("MasterColumn", MasterColumnSchema);
