// import FilePreview from "./shared/lib/prer";
 


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
                const user: any = true
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

            
            });

            socket.on("disconnect", () => {
                socket.removeAllListeners();
            });
        });


    io.of("/file-upload").on("connection", (socket: any) => {
     });
};



