import bcrypt from "bcrypt-nodejs";
import mongoose, { Schema, Types } from "mongoose";
import jwt from "jsonwebtoken";
import { appConfig } from "../../appConfig";
import { UserRoles } from "./UserRoles";


export type UserDocument = mongoose.Document & {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: {
        type: string;
        enum: [UserRoles.Admin, UserRoles.DataSteward, UserRoles.SuperAdmin];
        default: UserRoles.DataSteward;
    };
    countries: [];
    token: string;
    isDeleted: boolean;
    comparePassword: comparePasswordFunction;
};

type comparePasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void;

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
    role: {
        type: String,
        enum: [UserRoles.Admin, UserRoles.DataSteward, UserRoles.SuperAdmin],
        default: UserRoles.DataSteward,
    },
    countries: [String],
    token: String,
    isDeleted:  Boolean 
}, { timestamps: true, collection: "users" });

/**
 * Password hash middlewares.
 */
userSchema.pre("save", function save(next) {
    const user = this as UserDocument;
    if (!user.isModified("password")) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});


userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, appConfig.secret, { expiresIn: "365d" });    
    user.token = token;
    await user.save();
    return token;
};

const comparePassword = async function (candidatePassword: string, cb: (arg0: mongoose.Error, arg1: boolean) => void) {
    bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
        cb(err, isMatch);
    });
};

userSchema.methods.comparePassword = comparePassword;

export const User = mongoose.model<UserDocument>("User", userSchema);





