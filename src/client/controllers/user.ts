import { Request, Response, NextFunction } from "express";
import { User } from "../../shared/models/User";

/**
 * Add a new user
 * @param {e.Request} req
 * @param {e.Response} res
 */
export const addUser = (req: Request, res: Response) => {
    const { firstName, lastName, email, password, role, countries } = req.body;
        User.findOne({ email: email }).then((user) => {
        if (!user) {
            User.create({
                firstName: firstName,
                lastName: lastName,
                email: email.toLowerCase(),
                password: password,
                role: role,
                countries: countries,
                isDeleted: false as any
            })
            .then(User => {
                res.json(User);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving notes."
                });
            });
        } else {
            res.json({
                error: "Email already registered."
            });
        }
    });
};


export const deleteUser = (req: Request, res: Response) => {
    User.updateOne({ _id: req.params.id }, { isDeleted: true as any})
    .then((response: any) => {
        res.json(response);
    });
};


/**
 * Save the data
 * @param {e.Request} req
 * @param {e.Response} res
 */
export const update = (req: Request, res: Response) => {
    User.findOne({ _id: req.body.userId }).then((user: any) => {
        if (user) {
            user.firstName = req.body.firstName;
            user.password = req.body.password;
            user.email = req.body.email.toLowerCase();
            user.role = req.body.role;
            user.countries = req.body.countries;
            user.save().then((data: any) => {
                res.json(data);
            }).catch((err: any) => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving notes."
                });
            });
        }
    });
};

/**
 * user login
 * @param {e.Request} req
 * @param {e.Response} res
 */
export const loginUser = (req: Request, res: Response) => {
    const { email, password } = req.body;

    User.findOne({ email: email.toLowerCase(), isDeleted: false as any }).then((user: any) => {
        if (!user) {
            return res.json({ "error": "Not a valid credentials" });
        }
        user.comparePassword(password, (err: Error, isMatch: boolean) => {
            if (!isMatch) {
                return res.json({ "error": "Not a valid credentials" });
            }
            const token = user.generateAuthToken();
            return res.json(user);
        });
    }).catch(err => {
        res.json({
            message: err.message || "Invalid email or password."
        });
    });
};

/**
 * Get Users
 * @param {e.Request} req
 * @param {e.Response} res
 */
export const getUsers = (req: Request, res: Response) => {
    User.find({ isDeleted: false as any}).then((users: any) => {
        res.json(users);
    }).catch(err => {
        res.json({
            message: err.message || "Invalid email or password."
        });
    });
};

