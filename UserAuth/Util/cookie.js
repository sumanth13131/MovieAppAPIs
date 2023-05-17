import dotenv from "dotenv";
import { isValidUsernamePassword } from "./dbutil.js";
dotenv.config("../../.env");
export let strategy = {
    name: "login",
    scheme: "cookie",
    handler: {
        cookie: {
            name: "sid",
            password: process.env.COOKIE_ENCRYPT_KEY,
            isSecure: false,
            isSameSite: false,
        },
        redirectTo: "/sign-in",
        validate: async (request, session) => {
            if (isValidUsernamePassword(session.username, session.password)) {
                return {
                    isValid: true,
                    credentials: { name: session.username },
                };
            }
            return { isValid: false, credentials: null };
        },
    },
};
