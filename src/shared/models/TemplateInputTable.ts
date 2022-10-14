import mongoose, { Schema } from "mongoose";

export type templateInputTableRequest = mongoose.Document & {
    tableName: String;
    columnSeparator: String;
    skipRows: String;
    rows: [{ type: Schema.Types.ObjectId; ref: "ChangeInputRowTemplateRequest" }];
};

const templateInputTableRequestSchema = new mongoose.Schema(
    {
        tableName: String,
        columnSeparator: String,
        skipRows: String,
        rows: [{ type: Schema.Types.ObjectId, ref: "ChangeInputRowTemplateRequest" }]
    },
    { timestamps: true, collection: "templateInputTableRequest" }
);

export const ChangeInputTableTemplateRequest = mongoose.model<templateInputTableRequest>("ChangeInputTableTemplateRequest", templateInputTableRequestSchema);

// import mongoose, { Schema } from "mongoose";

// export type templateInputTableRequest = mongoose.Document & {
//     workbookId: { type: Schema.Types.ObjectId, ref: "ChangeInputWorkbookTemplateRequest" },
//     tableName:String
//     };

// const templateInputTableRequestSchema = new mongoose.Schema({

//     workbookId: { type: Schema.Types.ObjectId, ref: "ChangeInputWorkbookTemplateRequest" },
//     tableName:String
//     }, { timestamps: true , collection: "templateInputTableRequest"});

// export const ChangeInputTableTemplateRequest = mongoose.model<templateInputTableRequest>("ChangeInputTableTemplateRequest", templateInputTableRequestSchema);
