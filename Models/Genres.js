import { DataTypes, Model } from "sequelize";
import sequelize_conn from "./SequelizeConn.js";

export class Genres extends Model {}

Genres.init(
    {
        Genre_Id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        Genres: { type: DataTypes.STRING, allowNull: false },
    },
    {
        sequelize: sequelize_conn,
        tableName: "genre",
        modelName: "Genre",
        timestamps: false,
    }
);
