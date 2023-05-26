import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import logger from "../Logging/util.js";
dotenv.config("../.env");

const sequelize_conn = new Sequelize(process.env.DATABASE_CONN_URI, {
    pool: {
        max: 10,
    },
    logging: (query) => logger.info(query),
});

export default sequelize_conn;
