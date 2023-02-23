import path from "path";
const _ = require("lodash"); 
export const env = process.env.NODE_ENV || "development";

const envConfig: any = {
    default: {
        root: `${path.resolve(__dirname).replace("/dist", "").replace("dist", "")}`,
       
        cmdXlsx: `${path
            .resolve(__dirname + "/node_modules/from-xlsx/bin/xlsx.njs")
            .replace("/dist", "")
            .replace("dist", "")}`,
        sessionSecret: "gdfgdfaereredf",
        secret: "oi8kK8l4J6",
        assets: {
            dataLoad: {
                rawFiles: "uploads/data-load/raw-files",
                archives: "uploads/data-load/archives"
            }
        },
        email: { 
            from: "mona44146@outlook.com"
        },
        smtp: {
            host: "smtp.office365.com", // hostname
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            auth: {
                user: "mona44146@outlook.com",
                pass: "Monakarthik&143"
            },
            tls: {
                ciphers: "SSLv3"
            }
        }
    },
    development: {
        database: {
            name: "microfrontends",
            host: "microfrontends.74hsebi.mongodb.net",
            username: "mounika",
            password: "mounika",
            mongoImportHost: "Cluster0-shard-0/cluster0-shard-00-00-ixhal.mongodb.net:27017,cluster0-shard-00-01-ixhal.mongodb.net:27017,cluster0-shard-00-02-ixhal.mongodb.net:27017",
            getUri: () => {
                return `mongodb+srv://${envConfig.development.database.username}:${encodeURIComponent(envConfig.development.database.password)}@${envConfig.development.database.host}/${envConfig.development.database.name
                    }?retryWrites=true&w=majority`;
            },

            getCommand: (csvName) => {
                return `mongoimport --uri \"mongodb+srv://ds_admin:YVd45jahn1tIDSEA@cluster0-ixhal.mongodb.net/datastewardDBv2?retryWrites=true&w=majority\" --collection marketSales --type TSV --file ${csvName} --headerline --numInsertionWorkers=2`;
            }


        },
        
    }
};

console.log(_.merge({}, envConfig.default, envConfig[env]));

export const appConfig = _.merge({}, envConfig.default, envConfig[env]);
