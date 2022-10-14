import express from "express";
import cors from "cors";
import compression from "compression";  // compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import lusca from "lusca";
import mongo from "connect-mongo";
import flash from "express-flash";
import path from "path";
import passport from "passport";
import { appConfig } from "./appConfig";
import * as Db from "./shared/util/db";

const MongoStore = mongo(session);
const clientRoutes = require("./client/routes");

// Create Express server
const app = express();

Db.connect();





// Express configuration
app.use(cors());

app.set("port", process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: appConfig.sessionSecret,
    store: new MongoStore({
        url: appConfig.database.getUri(),
        autoReconnect: true
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
app.use((req, res, next) => {
    // After successful login, redirect back to the intended page
    if (!req.user &&
        req.path !== "/login" &&
        req.path !== "/signup" &&
        !req.path.match(/^\/auth/) &&
        !req.path.match(/\./)) {
        req.session.returnTo = req.path;
    } else if (req.user &&
        req.path == "/account") {
        req.session.returnTo = req.path;
    }
    next();
});

app.use(
    express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

app.locals = {
    fileUploadPath: "./public/uploads/"
};

app.use(clientRoutes);

export default app;
