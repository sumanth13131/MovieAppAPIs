import dotenv from "dotenv";
import { Op } from "sequelize";
import { Genres } from "../../Models/Genres.js";
import { Movies } from "../../Models/Movies.js";
import { Actors } from "../../Models/Actors.js";
import { User_Rating } from "../../Models/User_Rating.js";
import { Users } from "../../Models/Users.js";
import sequelize_conn from "../../Models/SequelizeConn.js";
import logger from "../../Logging/util.js";

dotenv.config("../../.env");

export async function getGenres() {
    let data = [];
    try {
        data = await Genres.findAll();
    } catch (error) {
        logger.error(error);
        // console.log(error);
    } finally {
        return data;
    }
}
export async function getByGenre(genre) {
    let data = [];
    try {
        data = await Genres.findAll({
            where: {
                Genres: genre,
            },
        });
    } catch (error) {
        logger.error(error);
        // console.log(error);
    } finally {
        return data;
    }
}

export async function getGenreMovies() {
    let result = null;
    try {
        result = await Genres.findAndCountAll();
    } catch (error) {
        logger.error(error);
        // console.log(error);
    } finally {
        return result;
    }
}

export async function getMovieDetailsById(id) {
    let data = null;
    try {
        data = await Movies.findByPk(id, { include: [Genres, Actors, Users] });
    } catch (error) {
        logger.error(error);
        // console.log(error);
    } finally {
        return data;
    }
}

export async function getMovieIDSWithMatch(text, field, offset, limit) {
    let data = [];
    try {
        await Movies.findAll({
            where: {
                [field]: {
                    [Op.iRegexp]: text,
                },
            },
            attributes: ["Movie_Id"],
            offset: offset,
            limit: limit,
        });
    } catch (error) {
        logger.error(error);
        // console.log(error);
    } finally {
        return data;
    }
}

export async function getMovieIdsFromGenresWithMatch(text, field) {
    let data = null;
    try {
        data = await Genres.findOne({
            where: {
                [field]: {
                    [Op.iRegexp]: text,
                },
            },
        });
    } catch (error) {
        logger.error(error);
        // console.log(error);
    } finally {
        return data;
    }
}

export async function getMovieIdsFromActossWithMatch(text, field) {
    let data = null;
    try {
        data = await Actors.findOne({
            where: {
                [field]: {
                    [Op.iRegexp]: text,
                },
            },
        });
    } catch (error) {
        logger.error(error);
        // console.log(error);
    } finally {
        return data;
    }
}

export async function getUniqueDataFromModel(model, field) {
    let data = null;
    try {
        data = await model.aggregate(field, "DISTINCT", { plain: false });
    } catch (error) {
        logger.error(error);
        // console.log(error);
    } finally {
        return data;
    }
}

export async function getUserId(username) {
    let data = null;
    try {
        let temp_data = await Users.findOne({
            where: {
                User_Name: username,
            },
        });
        data = temp_data.User_Id;
    } catch (error) {
        logger.error(error);
        // console.log(error);
    } finally {
        return data;
    }
}

export async function getUserRating(user_id, movie_id) {
    let data = 0;
    try {
        let temp_data = await User_Rating.findOne({
            where: {
                [Op.and]: {
                    User_Id: user_id,
                    Movie_Id: movie_id,
                },
            },
        });
        if (temp_data == null) data = 0;
        else data = temp_data.Rating;
    } catch (error) {
        logger.error(error);
        // console.log(error);
    } finally {
        return data;
    }
}

export async function getMovieRating(movie_id) {
    let data = 0;
    try {
        let temp_data = await User_Rating.findAll({
            where: {
                Movie_Id: movie_id,
            },
            attributes: [
                [
                    sequelize_conn.fn("avg", sequelize_conn.col("Rating")),
                    "rating",
                ],
            ],
        });
        if (temp_data[0].get("rating") == null) data = 0;
        else data = temp_data[0].get("rating");
    } catch (error) {
        logger.error(error);
        // console.log(error);
    } finally {
        return data;
    }
}

export async function getMovies(offset, limit) {
    let data = [];

    try {
        data = await Movies.findAll({
            offset: offset,
            limit: limit,
            attributes: ["Movie_Id"],
            order: [["Movie_Id", "ASC"]],
        });
    } catch (error) {
        logger.error(error);
        // console.log(error);
    } finally {
        return data;
    }
}
