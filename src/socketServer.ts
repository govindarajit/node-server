import FilePreview from "./shared/lib/preview/filePreview";
import { User } from "./shared/models/User";
import { appConfig } from "./appConfig";
import logger from "./shared/util/logger";
import DataLoad from "./shared/lib/dataLoad/dataLoad";


const io = require("socket.io")();
const jwt = require("jsonwebtoken");

/**
 * Start file preview
 * @param server
 */
export const start = (server: any) => {

    io.listen(server);
    io.use(async function (socket: any, next: any) {
        if (socket.handshake.query && socket.handshake.query.token) {
            try {
                const decoded: any = jwt.verify(socket.handshake.query.token, appConfig.secret);
                const user: any = await User.findOne({ _id: decoded._id, token: socket.handshake.query.token });
                if (!user) {
                    throw new Error();
                }
                next();
            } catch (e) {
                return next(new Error("Authentication error"));
            }
        }
        else {
            return next(new Error("Authentication error"));
        }
    })
        .on("connection", function (socket: any) {
            // Connection now authenticated to receive further events
            socket.on("create-file-preview", (data: any) => {
                if (!data.files.length) {
                    return;
                }

                FilePreview.create(data.files).subscribe((file: any) => {
                    socket.emit("FILE_PREVIEW_CREATION_STATUS", file);
                });
            });

            socket.on("disconnect", () => {
                socket.removeAllListeners();
            });
        });


    io.of("/file-upload").on("connection", (socket: any) => {
        socket.emit("SANITY_CHECK", { message: "connected..." });

        socket.on("connect", () => {
            console.log("client join the server");
        });

        socket.on("disconnect", () => {
            console.log("client disconnected from server");
        });

        socket.on("sanity-check", (data: any) => {
            logger.debug("*** sanity check started..");

            const dataLoad = new DataLoad();
            dataLoad.import(data).subscribe((response: any) => {
                console.log("connected status: ", socket.connected);
                socket.emit("SANITY_CHECK", response);
            });


            // if (data.inputFileType === "csv") {
            //     const csvImport = new CsvDataLoad();
            //     csvImport.import(data).subscribe((response: any) => {
            //         console.log("connected status: ", socket.connected);
            //         socket.emit("SANITY_CHECK", response);
            //     });
            // } else if ("xlsx") {
            //     const excelImport = new ExcelDataLoad();
            //     excelImport.import(data).subscribe((response: any) => {
            //         // console.log("connected status: ", socket.connected);
            //         // console.log("response: ", response);
            //         socket.emit("SANITY_CHECK", response);
            //     });
            // }
        });
    });
};



