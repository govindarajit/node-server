import path from "path";
const _ = require("lodash");
// export const env = process.env.NODE_ENV || "testing";
export const env = process.env.NODE_ENV || "development";

const envConfig: any = {
    default: {
        root: `${path.resolve(__dirname).replace("/dist", "").replace("dist", "")}`,
        cmdXlsx: `${path
            .resolve(__dirname + "/node_modules/solutionec-xlsx/bin/xlsx.njs")
            .replace("/dist", "")
            .replace("dist", "")}`,
        sessionSecret: "ashdfjhasdlkjfhalksdjhflak",
        secret: "or8kN8l1L7",
        assets: {
            dataLoad: {
                rawFiles: "uploads/data-load/raw-files",
                archives: "uploads/data-load/archives"
            }
        },
        email: {
            admin: "admin@solutionec.com",
            solutionec: "developer@solutionec.com"
        },
        smtp: {
            host: "smtp.office365.com", // hostname
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            auth: {
                user: "developer@solutionec.com",
                pass: "Bangalore!3030"
            },
            tls: {
                ciphers: "SSLv3"
            }
        }
    },
    development: {
        database: {
            name: "test",
            host: "cluster0.bwxhn38.mongodb.net",
            username: "User123",
            password: "User123",
            mongoImportHost: "Cluster0-shard-0/cluster0-shard-00-00-ixhal.mongodb.net:27017,cluster0-shard-00-01-ixhal.mongodb.net:27017,cluster0-shard-00-02-ixhal.mongodb.net:27017",
            getUri: () => {
                return `mongodb+srv://${envConfig.development.database.username}:${encodeURIComponent(envConfig.development.database.password)}@${envConfig.development.database.host}/${envConfig.development.database.name
                    }?retryWrites=true&w=majority`;
            },

            getCommand: (csvName) => {
                return `mongoimport --uri \"mongodb+srv://ds_admin:YVd45jahn1tIDSEA@cluster0-ixhal.mongodb.net/datastewardDBv2?retryWrites=true&w=majority\" --collection marketSales --type TSV --file ${csvName} --headerline --numInsertionWorkers=2`;
            }


        },
        email: {
            fileUploadNotificationEmailList: ["developer@solutionec.com"],
            fileDelayEmailList: [],
            fileApprovedEmailList: [],
            fileRejectedEmailList: [],
            fileDeleteEmailList: [],
            admin: "admin@solutionec.com",
            solutionec: "developer@solutionec.com"
        }
    }
};

console.log(_.merge({}, envConfig.default, envConfig[env]));

export const appConfig = _.merge({}, envConfig.default, envConfig[env]);
