import {
    getHomeFeed,
    getMovieMeta,
    getSearchData,
    getUniqueData,
    postRating,
    reIndexMovieDetails,
} from "../helper.js";
import dotenv from "dotenv";
import redis from "../Util/redisutil.js";
import { getUserId, getUserRating } from "../Util/dbutil.js";
dotenv.config("../../.env");

const IS_CACHE_ENABLED = process.env.IS_CACHE_ENABLED == "true" ? true : false;

export let handler = {
    data: async (request, reply) => {
        let genre = request.query.genre;
        let offset = request.query.offset;
        let limit = request.query.limit;
        let data;
        if (IS_CACHE_ENABLED) {
            let homeFeed = await redis.get(
                `home_feed_${genre}_${offset}_${limit}`
            );
            if (homeFeed) {
                data = JSON.parse(homeFeed);
            } else {
                data = await getHomeFeed(genre, offset, limit);
                await redis.setEx(
                    `home_feed_${genre}_${offset}_${limit}`,
                    1,
                    JSON.stringify(data)
                );
            }
        } else {
            data = await getHomeFeed(genre, offset, limit);
        }
        let resp = reply.response({ data: data });
        resp.header("Content-Type", "application/json");
        resp.response = data ? 200 : 500;
        return resp;
    },

    id: async (request, reply) => {
        let id = request.params.id;
        let details;
        if (IS_CACHE_ENABLED) {
            let idData = await redis.get(`m_${id}`);
            if (idData) {
                details = JSON.parse(idData);
            } else {
                details = await getMovieMeta(id);

                await redis.setEx(`m_${id}`, 60, JSON.stringify(details));
            }
        } else {
            details = await getMovieMeta(id);
        }
        let resp = reply.response(details);
        resp.header("Content-Type", "application/json");
        resp.response = details ? 200 : 500;
        return resp;
    },

    search: async (request, reply) => {
        let text = request.query.text;
        let field = request.query.field;
        let offset = request.query.offset;
        let limit = request.query.limit;

        let data;
        if (IS_CACHE_ENABLED) {
            let searchData = await redis.get(
                `${text}_${field}_${offset}_${limit}`
            );
            if (searchData) {
                data = JSON.parse(searchData);
            } else {
                data = await getSearchData(text, field, offset, limit);
                await redis.setEx(
                    `${text}_${field}_${offset}_${limit}`,
                    60,
                    JSON.stringify(data)
                );
            }
        } else {
            data = await getSearchData(text, field, offset, limit);
        }

        let resp = reply.response({ data: data });
        resp.header("Content-Type", "application/json");
        resp.response = data ? 200 : 500;
        return resp;
    },

    uniqueFiled: async (request, reply) => {
        let field = request.query.field;
        let data;
        if (IS_CACHE_ENABLED) {
            let searchData = await redis.get(field);
            if (searchData) {
                data = JSON.parse(searchData);
            } else {
                data = await getUniqueData(field);
                await redis.setEx(field, 60, JSON.stringify(data));
            }
        } else {
            data = await getUniqueData(field);
        }
        let resp = reply.response({ data: data });
        resp.header("Content-Type", "application/json");
        resp.response = data ? 200 : 500;
        return resp;
    },

    rating: async (request, reply) => {
        let username = request.auth.credentials.name;
        let movie_id = request.payload.movie_id;
        let rating = request.payload.rating;
        let rated = await postRating(username, movie_id, rating);
        let resp = reply.response("Thanks for rating");
        resp.response = rated ? 200 : 500;
        return resp;
    },

    my_rating: async (request, reply) => {
        let user_id = await getUserId(request.auth.credentials.name);
        let movie_id = request.query.movie_id;
        let rating = await getUserRating(user_id, movie_id);
        let resp = reply.response({ rating: rating });
        resp.header("Content-Type", "application/json");
        return resp;
    },

    reindex: async (request, reply) => {
        if (request.auth.credentials.name == "admin") {
            let isReIndexed = await reIndexMovieDetails();
            let resp;
            if (isReIndexed) {
                resp = reply.response("ReIndexed Successfully");
                resp.response = 200;
            } else {
                resp = reply.response("ReIndexed Failed");
                resp.response = 500;
            }
            return resp;
        } else {
            let resp = reply.response("No Access");
            resp.response = 402;
            return resp;
        }
    },
};
