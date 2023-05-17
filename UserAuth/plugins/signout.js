import { handler } from "./handlers.js";

export default {
    name: "signout",
    version: "1.0.1",
    register: async (server, options) => {
        server.route({
            method: "GET",
            path: "/api/sign-out",
            handler: handler.signout,
        });
    },
};
