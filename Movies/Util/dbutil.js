import dotenv from "dotenv";
import {
    Actors,
    Genres,
    Movies,
    User_Rating,
    Users,
    sequelize,
} from "../../Models/models.js";
import { Op } from "sequelize";
dotenv.config("../../.env");

export async function getGenres() {
    return await Genres.findAll();
}
export async function getByGenre(genre) {
    return await Genres.findAll({
        where: {
            Genres: genre,
        },
    });
}

export async function getGenreMovies() {
    return await Genres.findAndCountAll();
}

export async function getMovieDetailsById(id) {
    return await Movies.findByPk(id, { include: [Genres, Actors, Users] });
}

export async function getMovieIDSWithMatch(text, field, offset, limit) {
    return await Movies.findAll({
        where: {
            [field]: {
                [Op.iRegexp]: text,
            },
        },
        attributes: ["Movie_Id"],
        offset: offset,
        limit: limit,
    });
}

export async function getMovieIdsFromGenresWithMatch(text, field) {
    return await Genres.findOne({
        where: {
            [field]: {
                [Op.iRegexp]: text,
            },
        },
    });
}

export async function getMovieIdsFromActossWithMatch(text, field) {
    return await Actors.findOne({
        where: {
            [field]: {
                [Op.iRegexp]: text,
            },
        },
    });
}

export async function getUniqueDataFromModel(model, field) {
    return await model.aggregate(field, "DISTINCT", { plain: false });
}

export async function getUserId(username) {
    let user_details = await Users.findOne({
        where: {
            User_Name: username,
        },
    });
    return user_details.User_Id;
}

export async function getUserRating(user_id, movie_id) {
    let data = await User_Rating.findOne({
        where: {
            [Op.and]: {
                User_Id: user_id,
                Movie_Id: movie_id,
            },
        },
    });
    if (data == null) {
        return 0;
    }
    return data.Rating;
}

export async function getMovieRating(movie_id) {
    let data = await User_Rating.findAll({
        where: {
            Movie_Id: movie_id,
        },
        attributes: [[sequelize.fn("avg", sequelize.col("Rating")), "rating"]],
    });
    if (data[0].get("rating") == null) {
        return 0;
    }
    return data[0].get("rating");
}

export async function getMovies(offset, limit) {
    return await Movies.findAll({
        offset: offset,
        limit: limit,
        attributes: ["Movie_Id"],
        order: [["Movie_Id", "ASC"]],
    });
}
