import { DataTypes, Model } from "sequelize";
import sequelize_conn from "./SequelizeConn.js";

export class User_Rating extends Model {}

User_Rating.init(
    {
        User_Id: {
            type: DataTypes.SMALLINT,
        },
        Movie_Id: {
            type: DataTypes.INTEGER,
        },
        Rating: {
            type: DataTypes.FLOAT,
        },
    },
    {
        sequelize: sequelize_conn,
        tableName: "user_rating",
        modelName: "User_Rating",
        timestamps: true,
    }
);
