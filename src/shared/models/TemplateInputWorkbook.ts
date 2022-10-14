import mongoose, { Schema } from "mongoose";

export type templateInputWorkbookRequest = mongoose.Document & {
    fileName: String;
    formatType: String;
    table: [{ type: Schema.Types.ObjectId; ref: "ChangeInputTableTemplateRequest" }];
};

const templateInputWorkbookRequestSchema = new mongoose.Schema(
    {
        fileName: String,
        formatType: String,
        table: [{ type: Schema.Types.ObjectId, ref: "ChangeInputTableTemplateRequest" }]
    },
    { timestamps: true, collection: "templateInputWorkbookRequest" }
);

export const ChangeInputWorkbookTemplateRequest = mongoose.model<templateInputWorkbookRequest>("ChangeInputWorkbookTemplateRequest", templateInputWorkbookRequestSchema);

// import mongoose, { Schema } from "mongoose";

// export type templateInputWorkbookRequest = mongoose.Document & {
//                         templateInputId:{ type: Schema.Types.ObjectId, ref: "ChangeInputTemplateRequest" },
//                         fileName: String,
//                        };

// const templateInputWorkbookRequestSchema = new mongoose.Schema({
//     templateInputId:{ type: Schema.Types.ObjectId, ref: "ChangeInputTemplateRequest" },
//     fileName: String,
//    }, { timestamps: true , collection: "templateInputWorkbookRequest"});

// export const ChangeInputWorkbookTemplateRequest = mongoose.model<templateInputWorkbookRequest>("ChangeInputWorkbookTemplateRequest", templateInputWorkbookRequestSchema);
