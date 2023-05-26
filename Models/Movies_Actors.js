import { DataTypes, Model } from "sequelize";
import sequelize_conn from "./SequelizeConn.js";

export class Movies_Actors extends Model {}

Movies_Actors.init(
    {
        Movie_Id: {
            type: DataTypes.INTEGER,
            unique: false,
        },
        Actor_Id: {
            type: DataTypes.INTEGER,
            unique: false,
        },
    },
    {
        sequelize: sequelize_conn,
        tableName: "movies_actors",
        modelName: "Movie_Actor",
        timestamps: false,
    }
);
