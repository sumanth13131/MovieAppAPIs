import Joi from "joi";
import { handler } from "./handlers.js";
export default {
    name: "signup",
    version: "1.0.1",
    register: async (server, options) => {
        server.route({
            method: "POST",
            path: "/api/sign-up",
            handler: handler.signup,
            options: {
                auth: {
                    mode: "try",
                },
                validate: {
                    payload: Joi.object({
                        username: Joi.string().min(3).max(15),
                        email: Joi.string().min(5).max(30),
                        password: Joi.string().min(5).max(15),
                    }),
                },
            },
        });
    },
};
