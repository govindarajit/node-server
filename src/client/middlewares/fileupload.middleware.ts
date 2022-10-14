import path from "path";
import { appConfig } from "../../appConfig";

const multer = require("multer");
const uniqueString = require("unique-string");

const storage = multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
        cb(null, path.resolve(appConfig.assets.dataLoad.rawFiles));
    },
    filename: function (req: any, file: any, cb: any) {
        const extension = file.originalname.split(".").pop();
        cb(null, `${uniqueString()}.${extension}`.toLocaleLowerCase());
    }
});

const fileUploadMiddleware = multer({ storage: storage });

export default fileUploadMiddleware;
