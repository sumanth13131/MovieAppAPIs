import dotenv from "dotenv";
dotenv.config();
import RelationInit from "./Models/Relations.js";
import Hapi from "@hapi/hapi";
import Signup from "./UserAuth/plugins/signup.js";
import Signin from "./UserAuth/plugins/signin.js";
import Signout from "./UserAuth/plugins/signout.js";
import App from "./Movies/plugins/app_apis.js";
import Cookie from "@hapi/cookie";
import { strategy } from "./UserAuth/Util/cookie.js";
import logger from "./Logging/util.js";

async function init() {
    RelationInit();
    const server = Hapi.server({
        port: process.env.PORT,
        routes: {
            cors: {
                credentials: true,
                additionalHeaders: [
                    "Content-Type",
                    "Authorization",
                    "Cookie",
                    "Set-Cookie",
                ],
                origin: ["*"],
            },
        },
    });

    // Cookie Plugin Registration.
    await server.register([Cookie]);
    server.auth.strategy(strategy.name, strategy.scheme, strategy.handler);
    server.auth.default(strategy.name);

    // Adding Plugins
    await server.register([Signup, Signin, Signout, App]);

    try {
        await server.start();
        logger.info(`Server Running at ${server.info.uri}`);
        // console.log("Server Running at", server.info.uri);
    } catch (error) {
        logger.error(error);
        // console.log(error);
    }
}
init();
