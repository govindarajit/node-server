import { Request, Response } from "express";
import { Country } from "../../shared/models/Country";


export const getAllCountryData = (req: Request, res: Response) => {
    const user: any = req.user;
    const query = (user.role==="SuperAdmin")?{}:{ "countryId": { $in: user.countries } };
    
    Country.find(query)
    .then(Country => {
        res.send(Country);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
};



