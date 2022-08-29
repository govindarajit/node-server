import { Request, Response, NextFunction } from "express";
import { ChangeTemplateRequest } from "../../shared/models/TemplateRequest";
import { ChangeInputTemplateRequest } from "../../shared/models/TemplateInput";
import { ChangeOutputTemplateRequest } from "../../shared/models/TemplateOutput";
import { ChangeMappingTemplateRequest } from "../../shared/models/TemplateMapping";

export const addTemplateRequest = (req: Request, res: Response) => {
    ChangeTemplateRequest.create(req.body)
            .then(User => {
                res.json(User);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving."
                });
            });
};

export const addInputTemplateRequest = (req: Request, res: Response) => {
    ChangeInputTemplateRequest.create(req.body)
            .then(User => {
                res.json(User);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving."
                });
            });
};

export const addOutputTemplateRequest = (req: Request, res: Response) => {
    ChangeOutputTemplateRequest.create(req.body)
            .then(User => {
                res.json(User);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving."
                });
            });
};

export const addMappingTemplateRequest = (req: Request, res: Response) => {
    ChangeMappingTemplateRequest.create(req.body)
            .then(User => {
                res.json(User);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving."
                });
            });
};

export const getTemplateRequestByUser = (req: Request, res: Response) => {
    ChangeTemplateRequest.find({userId:req.body.id})
            .then(Users => {
                res.json(Users);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving."
                });
            });
};

export const getTemplateRequestById = (req: Request, res: Response) => {
    ChangeTemplateRequest.findById({ _id: req.params.id }).populate('userId')
             .then(User => {
                res.json(User);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving."
                });
            });
};

export const deleteTemplateRequest = (req: Request, res: Response) => {
    ChangeTemplateRequest.deleteOne({ _id: req.params.id })
    .then((response: any) => {
        res.json(response);
    });
};