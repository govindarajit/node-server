import { Request, Response } from "express";
import { SheetSetting } from "../../shared/models/SheetSetting";
import { DataLoadSetting } from "../../shared/models/DataLoadSetting";



export const getPanelSettings = (req: Request, res: Response) => {
    SheetSetting.find()
        .populate({
            path: "panelId",
            populate: {
                path: "countryId"
            }
        })
        .then(PanelSetting => {
            res.send(PanelSetting);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });
};

export const addPanelSettings = (req: Request, res: Response) => {
    const {
        country,
        channel,
        panel,
        columnHeaderStart,
        dataRowStart,
        delimiter,
        fileFrequency,
        fileType,
        fileExpectedDate,
        nullValue,
        multiplier
    } = req.body;
    return DataLoadSetting.create({
        countryId: country,
        channelName: channel,
        panelName: panel,

    })
        .then(panelId => {
            return SheetSetting.create({
                panelId: panelId._id,
                columnIdentifier: "",
                columnHeaderStartPosition: columnHeaderStart,
                dataRowStartPosition: dataRowStart,
                fileFrequency: fileFrequency,
                fileExpectedDate: fileExpectedDate,
                outputFileName:"",
                nullValue:nullValue,
                multiplier:multiplier,
                fileType: fileType,
                delimiter: delimiter
            });
        }).then(data => {
            return DataLoadSetting.findByIdAndUpdate({ _id: (data as any).panelId }, { dataSettingId: data._id });
        })
        .then(result => {
            return res.json(result);
        })
        .catch(err => {
            console.log(err);
            return res.json(err);
        });
};

export const deletePanelSettings = (req: Request, res: Response) => {
    const { country, channel: channelName, panel: panelName } = req.body;
    return DataLoadSetting.findOneAndDelete({ channelName, panelName }).then((response) => {
        return SheetSetting.findOneAndDelete({ panelId: response._id });
    }).then(result => {
        return res.json(result);
    }).catch(err => {
        console.log(err);
        return res.json(err);
    });
};

export const getPanelData = (req: Request, res: Response) => {
    SheetSetting.find({ _id: req.query.panelsettingid }).select({ panelId: 1 })
        .populate({
            path: "panelId",
            populate: {
                path: "countryId"
            }
        })
        .then(PanelSetting => {
            res.send(PanelSetting);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });
};
