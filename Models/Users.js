import { DataTypes, Model } from "sequelize";
import sequelize_conn from "./SequelizeConn.js";

export class Users extends Model {}

Users.init(
    {
        User_Id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
        },
        User_Name: { type: DataTypes.TEXT, allowNull: false, unique: true },
        User_Email: { type: DataTypes.TEXT, allowNull: false },
        User_Password: { type: DataTypes.TEXT, allowNull: false },
    },
    {
        sequelize: sequelize_conn,
        tableName: "users",
        modelName: "User",
        timestamps: true,
    }
);
Users.addHook("beforeCreate", "customUserId", (record, options) => {
    record.User_Id = Date.now();
});
