import { Request, Response } from "express";
import { MasterColumn } from "./../../shared/models/MasterColumn";

export const getMasterColumnData = (req: Request, res: Response) => {

    MasterColumn.find().select("columnHeader _id").then((response) => {
            res.json(response);
        }
    ).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred"
        });
    });
};
