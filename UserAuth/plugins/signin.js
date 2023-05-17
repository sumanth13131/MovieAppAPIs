import Joi from "joi";
import { handler } from "./handlers.js";
export default {
    name: "signin",
    version: "1.0.1",
    register: async (server, options) => {
        server.route({
            method: "POST",
            path: "/api/sign-in",
            handler: handler.signin,
            options: {
                auth: {
                    mode: "try",
                },
                validate: {
                    payload: Joi.object({
                        username: Joi.string().min(3).max(15),
                        password: Joi.string().min(3).max(15),
                    }),
                },
            },
        });
    },
};
