import Bull from "bull";
import redis from "./Util/redisutil.js";
import dotenv from "dotenv";
import { getMovieRating } from "./Util/dbutil.js";
import { updateValueInIndex } from "../Search/util.js";
import { User_Rating } from "../Models/User_Rating.js";
import logger from "../Logging/util.js";
dotenv.config("../.env");

const IS_CACHE_ENABLED = process.env.IS_CACHE_ENABLED == "true" ? true : false;
const IS_SEARCH_ENABLE = process.env.IS_SEARCH_ENABLE == "true" ? true : false;

const rating_queue = new Bull("rating");
export default rating_queue;

rating_queue.process(async (job) => {
    await User_Rating.upsert({
        User_Id: job.data.User_Id,
        Movie_Id: job.data.Movie_Id,
        Rating: job.data.Rating,
    });

    if (IS_SEARCH_ENABLE) {
        let avg_rating = await getMovieRating(job.data.Movie_Id);
        await updateValueInIndex(
            process.env.ELASTIC_SEARCH_INDEX,
            job.data.Movie_Id,
            "AvgRating",
            avg_rating
        );
    }
});

rating_queue.on("completed", async (job) => {
    if (IS_CACHE_ENABLED) {
        await redis.del(`m_${job.data.Movie_Id}`);
    }
    logger.info(
        `User: ${job.data.User_Id} Rated: ${job.data.Rating} MovieId: ${job.data.Movie_Id} `
    );
    // console.log(
    //     `User: ${job.data.User_Id} Rated: ${job.data.Rating} MovieId: ${job.data.Movie_Id} `
    // );
});
