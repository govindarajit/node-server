import path from "path";

const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
        cb(null, path.resolve("uploads/chc-alignment"));
    },
    filename: function (req: any, file: any, cb: any) {
        const extension = file.originalname.split(".").pop();
        cb(null, `chc-alignment.${extension}`);
    }
});

const chcAlignmentMiddleware = multer({ storage: storage });

export default chcAlignmentMiddleware;
