import { MarketSale } from "../../../models/MarketSale";

export default class QueryBuilder {

    static getUniqueValues(field: string, previousFileId: string, currentFileId: string, data: any) {
        if (field === "Country") {
            return MarketSale.distinct(field, {
                "fileUploadId": { $in: [previousFileId, currentFileId] }
            });
        }

        if (field === "Panel") {
            return MarketSale.distinct(field, {
                "fileUploadId": { $in: [previousFileId, currentFileId] }
            });
        }

        if (field === "Channel") {
            return MarketSale.distinct(field, {
                "fileUploadId": { $in: [previousFileId, currentFileId] }
            });
        }

        if (field === "ATC4") {
            const thresholdMatch: any ={}; 
            thresholdMatch[`${data.threshold.selectedThreshold}`] = { "$lte": data.threshold.thresholdMax / 100, "$gte": data.threshold.thresholdMin / 100 }; 
            const group: any = {
                _id: {
                    "name": "$ATC4",
                }
            };
            const match: any = {
                fileUploadId: { "$in": [currentFileId, previousFileId] }
            };

            if(data.country){match.Country = { "$in": [data.country] }; }
            if(data.panel){match.Panel = { "$in": [data.panel] }; }
            if(data.channel){match.Channel = { "$in": [data.channel] }; }


            for (let i = 1; i <= 37; i++) {
                const j = (i).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });

                group[`LC${j}_current`] = {
                    "$sum": {
                        "$cond": [{
                            "$eq": ["$fileUploadId", currentFileId]
                        }, `$LC${j}`, 0]
                    }
                };
                group[`LC${j}_previous`] = {
                    "$sum": {
                        "$cond": [{
                            "$eq": ["$fileUploadId", previousFileId]
                        }, `$LC${j}`, 0]
                    }
                };
            }

            return MarketSale.aggregate([
                {
                    "$match": match
                },
                {
                    "$group": group
                },
                {
                    "$addFields": {
                    
                        "variance": {
                            "$cond": [{
                                "$eq": ["$LC01_previous", 0]
                            }, 0, { "$divide": [{ "$subtract": ["$LC02_current", "$LC01_previous"] }, "$LC01_previous"] }]
                        },
                        "LC01_mat_current": this.getMat(1, "current"),
                        "LC13_mat_current": this.getMat(13, "current"),
                        "LC02_mat_current": this.getMat(2, "current"),
                        "LC01_mat_previous": this.getMat(1, "previous"),
                    }
                },
                {
                    "$addFields": {
                        "LC02_mat_variance": {
                            "$cond": [{
                                "$eq": ["$LC01_mat_previous", 0]
                            }, 0, { "$divide": [{ "$subtract": ["$LC02_mat_current", "$LC01_mat_previous"] }, "$LC01_mat_previous"] }]
                        }
                    }
                },
                {
                    "$match": thresholdMatch
                }
            ]);
        }

        if (field === "Pack") {
            const thresholdMatch: any ={}; 
            thresholdMatch[`${data.threshold.selectedThreshold}`] = { "$lte": data.threshold.thresholdMax / 100, "$gte": data.threshold.thresholdMin / 100 }; 
            
            const group: any = {
                _id: {
                    "name": "$Pack",
                }
            };
            const match: any = {
                fileUploadId: { "$in": [currentFileId, previousFileId] },
                Product: { $in: data.selected }
            };

            for (let i = 1; i <= 25; i++) {
                const j = (i).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });

                group[`LC${j}_current`] = {
                    "$sum": {
                        "$cond": [{
                            "$eq": ["$fileUploadId", currentFileId]
                        }, `$LC${j}`, 0]
                    }
                };
                group[`LC${j}_previous`] = {
                    "$sum": {
                        "$cond": [{
                            "$eq": ["$fileUploadId", previousFileId]
                        }, `$LC${j}`, 0]
                    }
                };
            }

            return MarketSale.aggregate([
                {
                    "$match": match
                },
                {
                    "$group": group
                },
                {
                    "$addFields": {
                        "variance": {
                            "$cond": [{
                                "$eq": ["$LC01_previous", 0]
                            }, 0, { "$divide": [{ "$subtract": ["$LC02_current", "$LC01_previous"] }, "$LC01_previous"] }]
                        },
                        "LC01_mat_current": this.getMat(1, "current"),
                        "LC13_mat_current": this.getMat(13, "current"),
                        "LC02_mat_current": this.getMat(2, "current"),
                        "LC01_mat_previous": this.getMat(1, "previous"),
                    }
                },
                {
                    "$addFields": {
                        "LC02_mat_variance": {
                            "$cond": [{
                                "$eq": ["$LC01_mat_previous", 0]
                            }, 0, { "$divide": [{ "$subtract": ["$LC02_mat_current", "$LC01_mat_previous"] }, "$LC01_mat_previous"] }]
                        }
                    }
                },
                {
                    "$match": thresholdMatch
                }
            ]);

        }

        if (field === "Product") {
            const thresholdMatch: any ={}; 
            thresholdMatch[`${data.threshold.selectedThreshold}`] = { "$lte": data.threshold.thresholdMax / 100, "$gte": data.threshold.thresholdMin / 100 }; 
            

            const group: any = {
                _id: {
                    "name": "$Product",
                }
            };
            const match: any = {
                fileUploadId: { "$in": [currentFileId, previousFileId] },
                ATC4: { $in: data.selected }
            };

            for (let i = 1; i <= 25; i++) {
                const j = (i).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });

                group[`LC${j}_current`] = {
                    "$sum": {
                        "$cond": [{
                            "$eq": ["$fileUploadId", currentFileId]
                        }, `$LC${j}`, 0]
                    }
                };
                group[`LC${j}_previous`] = {
                    "$sum": {
                        "$cond": [{
                            "$eq": ["$fileUploadId", previousFileId]
                        }, `$LC${j}`, 0]
                    }
                };
            }



            return MarketSale.aggregate([
                {
                    "$match": match
                },
                {
                    "$group": group
                },
                {
                    "$addFields": {
                        "variance": {
                            "$cond": [{
                                "$eq": ["$LC01_previous", 0]
                            }, 0, { "$divide": [{ "$subtract": ["$LC02_current", "$LC01_previous"] }, "$LC01_previous"] }]
                        },
                        "LC01_mat_current": this.getMat(1, "current"),
                        "LC13_mat_current": this.getMat(13, "current"),
                        "LC02_mat_current": this.getMat(2, "current"),
                        "LC01_mat_previous": this.getMat(1, "previous"),
                    }
                },
                {
                    "$addFields": {
                        "LC02_mat_variance": {
                            "$cond": [{
                                "$eq": ["$LC01_mat_previous", 0]
                            }, 0, { "$divide": [{ "$subtract": ["$LC02_mat_current", "$LC01_mat_previous"] }, "$LC01_mat_previous"] }]
                        }
                       
                    }
                },
                {
                    "$match": thresholdMatch
                }
            ]);
        }
    }


    static async getAggregatedSales(previousFileId: string, currentFileId: string, queries: any) {

        const group: any = {
            _id: null
        };
        const match: any = {
            fileUploadId: { "$in": [currentFileId, previousFileId] }
        };

        if (queries.atc4) {
            match["ATC4"] = { $in: queries.atc4 };
        }
        if (queries.pack) {
            match["Pack"] = { $in: queries.pack };
        }
        if (queries.pack) {
            match["Product"] = { $in: queries.product };
        }

        for (let i = 1; i <= 37; i++) {
            const j = (i).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
            group[`un${j}_current`] = {
                "$sum": {
                    "$cond": [{
                        "$eq": ["$fileUploadId", currentFileId]
                    }, `$UN${j}`, 0]
                }
            };

            group[`lc${j}_current`] = {
                "$sum": {
                    "$cond": [{
                        "$eq": ["$fileUploadId", currentFileId]
                    }, `$LC${j}`, 0]
                }
            };

            group[`un${j}_previous`] = {
                "$sum": {
                    "$cond": [{
                        "$eq": ["$fileUploadId", previousFileId]
                    }, `$UN${j}`, 0]
                }
            };
            group[`lc${j}_previous`] = {
                "$sum": {
                    "$cond": [{
                        "$eq": ["$fileUploadId", previousFileId]
                    }, `$LC${j}`, 0]
                }
            };
        }


        return MarketSale.aggregate([
            {
                "$match": match
            },
            {
                "$group": group,
            }
        ]);
    }

    static getMat(start: number, timePeriod: string) {
        const mat: any = {
            "$add": []
        };

        for (let i = start; i <= start + 11; i++) {
            const j = (i).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
            mat["$add"].push(`$LC${j}_${timePeriod}`);
        }
        return mat;
    }
}











