import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { appConfig } from "../../appConfig";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token: any = req.header("Authorization").replace("Bearer ", "");
        const decoded: any = jwt.verify(token, appConfig.secret);
        //jwt.verify(token, "or8kN8l1L7")
        

        const user: any = await
            User.findOne({ _id: decoded._id, token: token });
        if (!user) {
            throw new Error();
        } 
        req.user = user;
        next();
    } catch (e) {
        console.log(e);
        res.status(401).send({ error: "User not Authenticated" });
    }
};

  

