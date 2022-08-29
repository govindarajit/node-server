import mongoose, { Schema } from "mongoose";

export type templateInputRequest = mongoose.Document & {
        inputDetails:[
                       {
                        fileName: String,
                        table:[
                            {
                                tableName:String,
                                rows:[
                                    {
                                        colName: String,
                                        datatype: String,
                                        mandatory: Boolean,
                                        format: String,
                                        inputingValues: String,
                                        values: String,
                                        regex: Boolean,
                                        fullMatch: Boolean,
                                        ignoreCase: Boolean,
                                    }
                                ]
                            }
                        ]
                       }
        ],
        createdAt: Date,
        updatedAt: Date,
    };

const templateInputRequestSchema = new mongoose.Schema({
    inputDetails:[
                   {
                    fileName: String,
                    table:[
                        {
                            tableName:String,
                            rows:[
                                {
                                    colName: String,
                                    datatype: String,
                                    mandatory: Boolean,
                                    format: String,
                                    inputingValues: String,
                                    values: String,
                                    regex: Boolean,
                                    fullMatch: Boolean,
                                    ignoreCase: Boolean,
                                }
                            ]
                        }
                    ]
                   }
    ],
    createdAt: Date,
    updatedAt: Date,
}, { timestamps: true , collection: "templateInputRequest"});

export const ChangeInputTemplateRequest = mongoose.model<templateInputRequest>("ChangeInputTemplateRequest", templateInputRequestSchema);