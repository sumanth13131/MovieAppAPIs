import Joi from "joi";
import { handler } from "./handlers.js";

export default {
    name: "app",
    version: "1.0.1",
    register: async (server, options) => {
        server.route([
            {
                method: "GET",
                path: "/api/home",
                handler: handler.data,
                options: {
                    validate: {
                        query: Joi.object({
                            genre: Joi.string().default("all"),
                            offset: Joi.number().min(0).default(0),
                            limit: Joi.number().min(1).default(10),
                        }),
                    },
                },
            },
            {
                method: "GET",
                path: "/api/movies/{id}",
                handler: handler.id,
                options: {
                    validate: {
                        params: Joi.object({
                            id: Joi.number().min(1),
                        }),
                    },
                },
            },
            {
                method: "GET",
                path: "/api/search",
                handler: handler.search,
                options: {
                    validate: {
                        query: Joi.object({
                            text: Joi.string().min(1).max(25),
                            field: Joi.string().default("Series_Title"),
                            offset: Joi.number().min(0).default(0),
                            limit: Joi.number().min(1).default(10),
                        }),
                    },
                },
            },
            {
                method: "GET",
                path: "/api/uniqueFileds",
                handler: handler.uniqueFiled,
                options: {
                    validate: {
                        query: Joi.object({
                            field: Joi.string(),
                        }),
                    },
                },
            },
            {
                method: "PATCH",
                path: "/api/rating",
                handler: handler.rating,
                options: {
                    validate: {
                        payload: Joi.object({
                            movie_id: Joi.number().min(1),
                            rating: Joi.number().min(0).max(5),
                        }),
                    },
                },
            },
            {
                method: "GET",
                path: "/api/my-rating",
                handler: handler.my_rating,
                options: {
                    validate: {
                        query: Joi.object({
                            movie_id: Joi.number().min(1),
                        }),
                    },
                },
            },

            {
                method: "POST",
                path: "/api/reindex",
                handler: handler.reindex,
            },
        ]);
    },
};
