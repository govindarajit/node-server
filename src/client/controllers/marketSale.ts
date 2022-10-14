import { Request, Response } from "express";
import QueryBuilder from "../../shared/lib/gap-analysis/market-sales/query-builder";
import { MarketSale } from "../../shared/models/MarketSale";
import { FileUpload } from "../../shared/models/FileUpload";
import { FileSetting } from "../../shared/models/FileSetting";
import moment from "moment";

/**
 * Get sales data
 * @param {e.Request} req
 * @param {e.Response} res
 */
export const getSalesData = (req: Request, res: Response) => {
    QueryBuilder
        .getAggregatedSales(req.params.previousFileId, req.params.currentFileId, req.body)
        .then((response) => {
            res.json(response);
        });
};

/**
 * get previous preview data
 * @param {e.Request} req
 * @param {e.Response} res
 */
export const getPreviousPreviewData = (req: Request, res: Response) => {
    let fileUploadInfo: any;

    const d1 = moment(req.query.date.toString(), "YYYY-MM-DD");

    FileUpload
        .findOne({
            dataLoadSetting: req.query.settingId as any, status: "APPROVED" as any,
            fileDate: {
                "$lt": new Date(+d1.format("YYYY"), +d1.format("M") - 1, +d1.format("D"))
            }
        })
        .sort({ "fileDate": -1 }).limit(1)
        .lean()
        .then((uploadInfo: any) => {
            // returns empty string
            if (!uploadInfo) {
                res.json([]);
            } else {
                fileUploadInfo = uploadInfo;
                const fileSettingIds = uploadInfo.files.map((file: any) => file.fileSetting);
                return FileSetting.find({ _id: { $in: fileSettingIds } });
            }
        }).then((fileSettings: any) => {
            if (fileSettings) {
                let sheetSettingIds: any = [];
                fileSettings.forEach((fileSetting: any) => {
                    sheetSettingIds = fileSetting.sheetSettings.map((sheetSetting: any) => sheetSetting._id);
                });

                const promises = sheetSettingIds.map((sheetSettingId: string) => {
                    return MarketSale
                        .find().and([
                            { "fileUploadId": fileUploadInfo._id.toString() }, { "sheetSetting": sheetSettingId.toString() }
                        ]).limit(75).lean();
                });

                Promise.all(promises)
                    .then((results: any) => {
                        let data: any = [];
                        results.forEach((result: any) => data = data.concat(result));
                        res.json(data);
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: err.message || "Some error occurred while retrieving notes."
                        });
                    });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });
};

/**
 * Get unique data
 * @param {e.Request} req
 * @param {e.Response} res
 */
export const getUniqueData = (req: Request, res: Response) => {
    QueryBuilder.getUniqueValues(req.params.field, req.params.previousFileId, req.params.currentFileId, req.body)
        // .then((response)=>{
        // })
        .then((response) => {
            res.json(response);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred"
            });
        });
};

/**
 * Delete market sales data
 * @param {e.Request} req
 * @param {e.Response} res
 */
export const deleteMarketSales = (req: Request, res: Response) => {
    MarketSale.deleteMany({ fileUploadId: req.params.fileUploadId })
        .then((response) => {
            res.json(response);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred"
            });
        });
};


export const getatc4Data = (req: Request, res: Response) => {
    MarketSale.find({ fileUploadId: req.params.fileUploadId, ATC4: { $in: req.body.atcList } }).then((atcData: any) => {
        res.json({ "Details": atcData });
    }).catch(err => {
        res.json({
            message: err.message || "Invalid Id."
        });
    });
};


export const getproductData = (req: Request, res: Response) => {
    MarketSale.find({ fileUploadId: req.params.fileUploadId, Product: { $in: req.body.productList } }).then((productlist: any) => {
        res.json({ "Details": productlist });
    }).catch(err => {
        res.json({
            message: err.message || "Invalid Id."
        });
    });
};
export const getpackData = (req: Request, res: Response) => {
    MarketSale.find({ fileUploadId: req.params.fileUploadId, Pack: { $in: req.body.packList } }).then((packdata: any) => {
        res.json({ "Details": packdata });
    }).catch(err => {
        res.json({
            message: err.message || "Invalid Id."
        });
    });
};


export const summary = (req: Request, res: Response) => {
    const currentFileUploadId = req.params.currentFileId;
    const previousFileUploadId = req.params.previousFileId;
    const field = req.params.field;

    MarketSale.aggregate([
        {
            "$match": {
                fileUploadId: {
                    "$in": [currentFileUploadId, previousFileUploadId]
                }
            }
        },
        {
            "$group": {
                "_id": null,
                "Current": {
                    "$addToSet": {
                        "$cond": [{
                            "$eq": ["$fileUploadId", currentFileUploadId]
                        }, field, 0]
                    }
                },
                "Previous": {
                    "$addToSet": {
                        "$cond": [{
                            "$eq": ["$fileUploadId", previousFileUploadId]
                        }, field, 0]
                    }
                },
            },
        },
        {
            "$addFields": {
                "CurrentCount": { "$size": "$Current" },
                "PreviousCount": { "$size": "$Previous" },
                "common": { "$setIntersection": ["$Current", "$Previous"] },
                "new": { "$setDifference": ["$Previous", "$Current"] },
                "missing": { "$setDifference": ["$Current", "$Previous"] },
                "total": { "$size": { "$setUnion": ["$Current", "$Previous"] } }
            }
        },
        {
            "$project": {
                "new": 1,
                "missing": 1,
                "total": 1
            }
        }

    ]).then((data: any) => {
        res.send({
            count: data.length,
            data: data
        });
    });
};










