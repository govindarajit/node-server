import { Request, Response } from "express";
import { ColumnSetting } from "../../shared/models/ColumnSetting";
import { MasterColumn } from "./../../shared/models/MasterColumn";

const time = 0;

export const getPanelColumnSettings = (req: Request, res: Response) => {
    ColumnSetting.find({ panelSettingId: req.query.panelsettingid })
    .populate([{ path: "masterColumnId" }])
    .then(result => {
        res.send(result);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
};

export const deletePanelColSetting = (req: Request, res: Response) => {
    ColumnSetting.deleteMany({ panelSettingId: req.params.id }).then((result) => {
        res.json(result);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred"
        });
    });
};

export const addPanelColSetting = (req: Request, res: Response) => {
    const numberOfMonths = Number(req.body.formData.numberOfMonths);
    const lcDirection = req.body.formData.lcDirection;
    const unDirection = req.body.formData.unDirection;
    const rxDirection = req.body.formData.rxDirection;
    const unStart = Number(req.body.formData.un);
    const lcStart = Number(req.body.formData.lc);
    const rxStart = Number(req.body.formData.rx);
    const unData: any = [];
    const rxData: any = [];
    const lcData: any = [];
    let headerData: any = [];
    let positionSetter = 0;

    headerData = req.body.masterColumn.map((obj: any) => {
        return {
            panelSettingId: req.body.panelSettingId,
            masterColumnId: obj._id,
            mapType: obj.typeValue,
            mapTypeValue: obj.mapTypeValue
        };
    });


    const arrayCreator = (noOfMonths: any, direction: any, arr: any, data: any, start: number) => {

        if (noOfMonths === 37 && direction === "a") {
            for (let i = 36; i >= 0; i--) {
                arr.push({
                    panelSettingId: req.body.panelSettingId,
                    masterColumnId: data[i]._id,
                    mapType: "position",
                    mapTypeValue: start + positionSetter,
                });
                positionSetter++;
            }
            positionSetter = 0;
        }

        if (noOfMonths === 36 && direction === "a") {
            for (let i = 36; i >= 1; i--) {
                arr.push({
                    panelSettingId: req.body.panelSettingId,
                    masterColumnId: data[i]._id,
                    mapType: "position",
                    mapTypeValue: start + positionSetter,
                });
                positionSetter++;
            }
            positionSetter = 0;
        }

        if (noOfMonths === 37 && direction === "d") {
            for (let i = 0; i <= 36; i++) {
                arr.push({
                    panelSettingId: req.body.panelSettingId,
                    masterColumnId: data[i]._id,
                    mapType: "position",
                    mapTypeValue: start + positionSetter,
                });
                positionSetter++;
            }
            positionSetter = 0;
        }

        if (noOfMonths === 36 && direction === "d") {
            for (let i = 1; i <= 36; i++) {
                arr.push({
                    panelSettingId: req.body.panelSettingId,
                    masterColumnId: data[i]._id,
                    mapType: "position",
                    mapTypeValue: start + positionSetter,
                });
                positionSetter++;
            }
            positionSetter = 0;
        }
        return arr;
    };

    ColumnSetting.create(headerData).then(() => {
        MasterColumn.find().select("columnHeader _id").then((response) => {
            const data = response.filter(obj => obj.columnHeader.startsWith("UN"));
            const arr = arrayCreator(numberOfMonths, unDirection, unData, data, unStart);
            return arr;

        }).then((unData) => {
            return ColumnSetting.create(unData).then();
        });
    }).then(() => {

            return MasterColumn.find().select("columnHeader _id").then((response) => {
                const data = response.filter(obj => (obj.columnHeader.startsWith("RX"))&&(obj.columnHeader!=="RX"));
                const arr = arrayCreator(numberOfMonths, rxDirection, rxData, data, rxStart);
                return arr;
            }).then((rxData) => {
                return ColumnSetting.create(rxData).then();
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred"
                });
            });
        }
    ).then(() => {
            return MasterColumn.find().select("columnHeader _id").then((response) => {
                const data = response.filter(obj => obj.columnHeader.startsWith("LC"));
                const arr = arrayCreator(numberOfMonths, lcDirection, lcData, data, lcStart);
                return arr;
            }).then((lcData) => {
                return ColumnSetting.create(lcData).then((response) => {
                        res.json(response);
                    }
                );
            });
        }
    ).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred"
        });
    });
};
