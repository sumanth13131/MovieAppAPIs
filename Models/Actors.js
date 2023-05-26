import { DataTypes, Model } from "sequelize";
import sequelize_conn from "./SequelizeConn.js";

export class Actors extends Model {}
Actors.init(
    {
        Actor_Id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        Actors: { type: DataTypes.STRING, allowNull: false },
    },
    {
        sequelize: sequelize_conn,
        tableName: "actors",
        modelName: "Actor",
        timestamps: false,
    }
);
