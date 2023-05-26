import { DataTypes, Model } from "sequelize";
import sequelize_conn from "./SequelizeConn.js";

export class Movies_Genres extends Model {}

Movies_Genres.init(
    {
        Movie_Id: {
            type: DataTypes.INTEGER,
            unique: false,
        },
        Genre_Id: {
            type: DataTypes.INTEGER,
            unique: false,
        },
    },
    {
        sequelize: sequelize_conn,
        tableName: "movies_genre",
        modelName: "Movie_Genre",
        timestamps: false,
    }
);
