// import mongoose, { Schema } from "mongoose";

// export type templateRequest = mongoose.Document & {
    
//         userId: { type: Schema.Types.ObjectId, ref: "User" },
//         templateDetails:{
//                           templateName: String,
//                           countryName: String,
//                           folderName: String,
//                           fileExtension: String,
//                         //   entrantName: { type: Schema.Types.ObjectId, ref: "Email" }
//                         },
//                         workbook: { type: Schema.Types.ObjectId; ref: "Country" };

                       
//     //     inputDetails:[
//     //                    {
//     //                     fileName: String,
//     //                     table:[
//     //                         {
//     //                             tableName:String,
//     //                             rows:[
//     //                                 {
//     //                                     colName: String,
//     //                                     datatype: String,
//     //                                     mandatory: Boolean,
//     //                                     format: String,
//     //                                     inputingValues: String,
//     //                                     values: String,
//     //                                     regex: Boolean,
//     //                                     fullMatch: Boolean,
//     //                                     ignoreCase: Boolean,
//     //                                 }
//     //                             ]
//     //                         }
//     //                     ]
//     //                    }
//     //     ],
//     //     outputDetails:[
//     //         {
//     //          fileName: String,
//     //          table:[
//     //              {
//     //                  tableName:String,
//     //                  rows:[
//     //                      {
//     //                          colName: String,
//     //                          datatype: String,
//     //                          mandatory: Boolean,
//     //                      }
//     //                  ]
//     //              }
//     //          ]
//     //         }
//     // ],
//     //     relationMapping:[
//     //         {
//     //             start: String,
//     //             end: String
//     //         }
//     //     ],
//         createdAt: Date,
//         updatedAt: Date,
//     };

// const templateRequestSchema = new mongoose.Schema({
    
//     userId: { type: Schema.Types.ObjectId, ref: "User" },
//     templateDetails:{
//                       templateName: String,
//                       countryName: String,
//                       folderName: String,
//                       fileExtension: String,
//                     //   entrantName: { type: Schema.Types.ObjectId, ref: "Email" }
//                     },
//     createdAt: Date,
//     updatedAt: Date,
// }, { timestamps: true , collection: "templateRequest"});

// export const ChangeTemplateRequest = mongoose.model<templateRequest>("ChangeTemplateRequest", templateRequestSchema);


import mongoose, { Schema } from "mongoose";

export type templateRequest = mongoose.Document & {
    
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        templateDetails:{
                          templateName: String,
                          countryName: String,
                          folderName: String,
                          fileExtension: String,
                          entrantName: String
                        },
                       
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
        outputDetails:[
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
                         }
                     ]
                 }
             ]
            }
    ],
        relationMapping:[
            {
                start: String,
                end: String
            }
        ],
        status:String,
        createdAt: Date,
        updatedAt: Date,
    };

const templateRequestSchema = new mongoose.Schema({
    
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    templateDetails:{
                      templateName: String,
                      countryName: String,
                      folderName: String,
                      fileExtension: String,
                      entrantName: String
                    },
                   
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
    outputDetails:[
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
                     }
                 ]
             }
         ]
        }
],
    relationMapping:[
        {
            start: String,
            end: String
        }
    ],
    status:String,
    reason:String,
    createdAt: Date,
    updatedAt: Date,
}, { timestamps: true , collection: "templateRequest"});

export const ChangeTemplateRequest = mongoose.model<templateRequest>("ChangeTemplateRequest", templateRequestSchema);