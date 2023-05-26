import { Op } from "sequelize";
import dotenv from "dotenv";
import { Users } from "../../Models/Users.js";
dotenv.config("../../.env");
export async function isUserExist(username) {
    let user = await Users.findOne({
        where: {
            User_Name: username,
        },
    });
    if (user) {
        return true;
    } else {
        return false;
    }
}

export async function saveUserDetails(username, email, password) {
    let password_obj = Buffer.from(password, "utf8");
    password = password_obj.toString("base64");
    await Users.create({
        User_Name: username,
        User_Email: email,
        User_Password: password,
    });
}

export async function isValidUsernamePassword(username, password) {
    let password_obj = Buffer.from(password, "utf8");
    password = password_obj.toString("base64");
    let user = await Users.findOne({
        where: {
            [Op.and]: [{ User_Name: username, User_Password: password }],
        },
    });
    if (user) {
        return true;
    } else {
        return false;
    }
}
