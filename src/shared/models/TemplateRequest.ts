import mongoose, { Schema } from "mongoose";

export type templateRequest = mongoose.Document & {
    userId: { type: Schema.Types.ObjectId; ref: "User" };
    templateDetails: {
        templateName: String;
        countryName: String;
        folderName: String;
        entrantName: String;
    };

    inputDetails: [
        {
            type: Schema.Types.ObjectId;
            ref: "ChangeInputWorkbookTemplateRequest";
        }
    ];
    outputDetails: [
        {
            type: Schema.Types.ObjectId;
            ref: "ChangeInputWorkbookTemplateRequest";
        }
    ];
    relationMapping: [
        {
            start: String;
            end: String;
            workbook: Number;
            table: Number;
            row: Number;
        }
    ];
    status: String;
    reason: String;
    relationRequired: Boolean;
    createdAt: Date;
    updatedAt: Date;
};

const templateRequestSchema = new mongoose.Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        templateDetails: {
            templateName: String,
            countryName: String,
            folderName: String,

            entrantName: String
        },
        inputDetails: [
            {
                type: Schema.Types.ObjectId,
                ref: "ChangeInputWorkbookTemplateRequest"
            }
        ],
        outputDetails: [{ type: Schema.Types.ObjectId, ref: "ChangeInputWorkbookTemplateRequest" }],
        relationMapping: [
            {
                start: String,
                end: String,
                workbook: Number,
                table: Number,
                row: Number
            }
        ],
        status: String,
        relationRequired: Boolean,
        reason: String,
        createdAt: Date,
        updatedAt: Date
    },
    { timestamps: true, collection: "templateRequest" }
);

export const ChangeTemplateRequest = mongoose.model<templateRequest>("ChangeTemplateRequest", templateRequestSchema);

// import mongoose, { Schema } from "mongoose";

// export type templateRequest = mongoose.Document & {
//     userId: { type: Schema.Types.ObjectId; ref: "User" };
//     templateDetails: {
//         templateName: String;
//         countryName: String;
//         folderName: String;

//         entrantName: String;
//     };

//     inputDetails: [
//         {
//             fileName: String;
//             formatType: String;
//             table: [
//                 {
//                     tableName: String;
//                     columnSeparator: String;
//                     skipRows: String;
//                     rows: [
//                         {
//                             colName: String;
//                             datatype: String;
//                             mandatory: Boolean;
//                             format: String;
//                             inputingValues: String;
//                             values: String;
//                             regex: Boolean;
//                             fullMatch: Boolean;
//                             ignoreCase: Boolean;
//                         }
//                     ];
//                 }
//             ];
//         }
//     ];
//     outputDetails: [
//         {
//             fileName: String;
//             table: [
//                 {
//                     tableName: String;
//                     rows: [
//                         {
//                             colName: String;
//                             datatype: String;
//                             mandatory: Boolean;
//                         }
//                     ];
//                 }
//             ];
//         }
//     ];
//     relationMapping: [
//         {
//             start: String;
//             end: String;
//         }
//     ];
//     status: String;
//     relationRequired: boolean;
//     createdAt: Date;
//     updatedAt: Date;
// };

// const templateRequestSchema = new mongoose.Schema(
//     {
//         userId: { type: Schema.Types.ObjectId, ref: "User" },
//         templateDetails: {
//             templateName: String,
//             countryName: String,
//             folderName: String,
//             entrantName: String
//         },

//         inputDetails: [
//             {
//                 fileName: String,
//                 formatType: String,
//                 table: [
//                     {
//                         tableName: String,
//                         columnSeparator: String,
//                         skipRows: String,
//                         rows: [
//                             {
//                                 colName: String,
//                                 datatype: String,
//                                 mandatory: Boolean,
//                                 format: String,
//                                 inputingValues: String,
//                                 values: String,
//                                 regex: Boolean,
//                                 fullMatch: Boolean,
//                                 ignoreCase: Boolean
//                             }
//                         ]
//                     }
//                 ]
//             }
//         ],
//         outputDetails: [
//             {
//                 fileName: String,
//                 table: [
//                     {
//                         tableName: String,
//                         rows: [
//                             {
//                                 colName: String,
//                                 datatype: String,
//                                 mandatory: Boolean
//                             }
//                         ]
//                     }
//                 ]
//             }
//         ],
//         relationMapping: [
//             {
//                 start: String,
//                 end: String
//             }
//         ],
//         status: String,
//         reason: String,
//         createdAt: Date,
//         updatedAt: Date
//     },
//     { timestamps: true, collection: "templateRequest" }
// );

// export const ChangeTemplateRequest = mongoose.model<templateRequest>("ChangeTemplateRequest", templateRequestSchema);
