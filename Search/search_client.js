import { Client } from "@elastic/elasticsearch";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config("../.env");

const search = new Client({
    node: process.env.ELASTIC_SEARCH_URL,
    auth: {
        username: process.env.ELASTIC_SEARCH_USERNAME,
        password: process.env.ELASTIC_SEARCH_PASSWORD,
    },

    tls: {
        ca: fs.readFileSync(process.env.ELASTIC_SEARCH_SSL_CERT),
        rejectUnauthorized: false,
    },
});

export default search;
