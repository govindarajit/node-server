import { Request, Response, NextFunction } from "express";
import { ChangeTemplateRequest } from "../../shared/models/TemplateRequest";
import { ChangeInputTemplateRequest } from "../../shared/models/TemplateInput";
import { ChangeOutputTemplateRequest } from "../../shared/models/TemplateOutput";
import { ChangeMappingTemplateRequest } from "../../shared/models/TemplateMapping";
import { ChangeInputWorkbookTemplateRequest } from "../../shared/models/TemplateInputWorkbook";
import { ChangeInputTableTemplateRequest } from "../../shared/models/TemplateInputTable";
import { ChangeInputRowTemplateRequest } from "../../shared/models/TemplateInputRow";
import Mailer from "../../shared/lib/mailer/mailer";

export const addTemplateRequest = (req: Request, res: Response) => {
    ChangeTemplateRequest.create(req.body)
            .then(User => {
                res.json(User);
                Mailer.sendMail(['deepesh@solutionec.com'],'Thank you for creating a template request','Template request',null)
                .then((res)=>console.log("Email triggered"))
                .catch((err)=>console.log("Email not triggered"))
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

export const addInputWorkbookTemplateRequest = (req: Request, res: Response) => {
    ChangeInputWorkbookTemplateRequest.create(req.body)
            .then(User => {
                res.json(User);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving."
                });
            });
};
export const addInputTableTemplateRequest = (req: Request, res: Response) => {
    ChangeInputTableTemplateRequest.create(req.body)
            .then(User => {
                res.json(User);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving."
                });
            });
};
export const addInputRowTemplateRequest = (req: Request, res: Response) => {
    ChangeInputRowTemplateRequest.create(req.body)
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

export const getTemplateRequest = (req: Request, res: Response) => {
    ChangeTemplateRequest.find().populate('userId')
             .then(Users => {
                res.json(Users);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving."
                });
            });
};

export const getAllTemplateRequestByUser = (req: Request, res: Response) => {
    ChangeTemplateRequest.find({userId:req.body.id}).populate('userId')
             .then(Users => {
                res.json(Users);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving."
                });
            });
};

export const updateStatusTemplateRequest = (req: Request, res: Response) => {
    let body={};
    let emailList=[];
    if(req.body.status==='approved')
    {
        emailList.push(req.body.email);
        body={status:'approved'};
    }
    else if (req.body.status==='rejected')
    {
        emailList.push(req.body.email);
        body={status:'rejected',reason:req.body.reason}
    }
    else if (req.body.status==='deleted')
    {
        emailList.push(req.body.email);
        emailList.push('chamarthi.vamsi@solutionec.com');
        body={status:'deleted',reason:req.body.reason}
    }
    console.log(req.body.email,emailList)

    ChangeTemplateRequest.updateOne({ _id: req.body.id },body)
             .then(Users => {
                Mailer.sendMail(emailList,`Your template request has been ${req.body.status}.`,'Template request status updated',null)
                .then((res)=>console.log("Email triggered"))
                .catch((err)=>console.log("Email not triggered"))
                res.json(Users);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving."
                });
            });
};

export const updateStatusByRejectTemplateRequest = (req: Request, res: Response) => {
    console.log(req.body);
    ChangeTemplateRequest.updateOne({ _id: req.body.id },{status:'pending'})
             .then(Users => {
                res.json(Users);
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

export const getWorkbookTemplateRequestById = (req: Request, res: Response) => {
    ChangeInputWorkbookTemplateRequest.findById({ _id: req.params.id }).populate('templateInputId')
             .then(User => {
                res.json(User);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving."
                });
            });
};