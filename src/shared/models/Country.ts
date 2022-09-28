import mongoose from "mongoose";

export type CountryDocument = mongoose.Document & {
    name: string;
    code: string;
    createdAt: Date;
    updatedAt: Date;
};

const countrySchema = new mongoose.Schema({
    name: String,
    code: String,
}, { timestamps: true ,collection: "countries"});

export const Country = mongoose.model<CountryDocument>("Country", countrySchema);
