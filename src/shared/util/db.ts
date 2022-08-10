import { appConfig } from "../../appConfig";
import bluebird from "bluebird";
import mongoose from "mongoose";

export const connect = () => {

    const mongoUrl = appConfig.database.getUri();
    mongoose.Promise = bluebird;

    return mongoose.connect(mongoUrl, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false

    }).then(() => {
        console.log(`Connected to db ${mongoUrl}`);
    }).catch(err => {
        console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    });
};

export const close = () => {
    mongoose.connection.close(() => {
        console.log("Db connection closed");
    });
};
