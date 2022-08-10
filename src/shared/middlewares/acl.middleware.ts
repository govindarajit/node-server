import { NextFunction, Request, Response } from "express";
export const allow = (userRoles: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user: any = req.user;
        if (userRoles.indexOf(user.role) > -1) {
            next();
        } else {
            res.status(403).json({ message: "Forbidden" }); // user is forbidden
        }
    };
};
