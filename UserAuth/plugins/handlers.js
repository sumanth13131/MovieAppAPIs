import {
    isUserExist,
    saveUserDetails,
    isValidUsernamePassword,
} from "../Util/dbutil.js";

export let handler = {
    signup: async (request, reply) => {
        let username = request.payload.username;
        let email = request.payload.email;
        let password = request.payload.password;

        if (!(await isUserExist(username))) {
            await saveUserDetails(username, email, password);
            let resp = reply.response("User added successfully");
            resp.statusCode = 200;
            return resp;
        } else {
            let resp = reply.response("User already exist");
            resp.statusCode = 409;
            return resp;
        }
    },
    signin: async (request, reply) => {
        if (request.auth.isAuthenticated) {
            let resp = reply.response(
                `User ${request.auth.credentials.name}:  Already Authenticated`
            );
            resp.statusCode = 200;
            return resp;
        } else if (
            await isValidUsernamePassword(
                request.payload.username,
                request.payload.password
            )
        ) {
            request.cookieAuth.set({
                username: request.payload.username,
                password: request.payload.password,
            });
            let resp = reply.response("User Authorizied Successfully");
            resp.statusCode = 200;
            return resp;
        } else {
            let resp = reply.response("Unauthorizied User");
            resp.statusCode = 401;
            return resp;
        }
    },
    signout: (request, reply) => {
        request.cookieAuth.clear();
        return reply.response("logout");
    },
};
