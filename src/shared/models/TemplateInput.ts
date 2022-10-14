// import mongoose, { Schema } from "mongoose";

// export type templateInputRequest = mongoose.Document & {
//         inputDetails:[
//             { type: Schema.Types.ObjectId, ref: "templateInputWorkbookRequest" }
//         ],
//         createdAt: Date,
//         updatedAt: Date,
//     };

// const templateInputRequestSchema = new mongoose.Schema({
//     inputDetails:[
//             { type: Schema.Types.ObjectId, ref: "templateInputWorkbookRequest" }
//         ],
//     createdAt: Date,
//     updatedAt: Date,
// }, { timestamps: true , collection: "templateInputRequest"});

// export const ChangeInputTemplateRequest = mongoose.model<templateInputRequest>("ChangeInputTemplateRequest", templateInputRequestSchema);

import mongoose, { Schema } from "mongoose";

export type templateInputRequest = mongoose.Document & {
        templateId:{ type: Schema.Types.ObjectId, ref: "ChangeTemplateRequest" },
        createdAt: Date,
        updatedAt: Date,
    };

const templateInputRequestSchema = new mongoose.Schema({
    templateId:{ type: Schema.Types.ObjectId, ref: "ChangeTemplateRequest" },
    createdAt: Date,
    updatedAt: Date,
}, { timestamps: true , collection: "templateInputRequest"});

export const ChangeInputTemplateRequest = mongoose.model<templateInputRequest>("ChangeInputTemplateRequest", templateInputRequestSchema);