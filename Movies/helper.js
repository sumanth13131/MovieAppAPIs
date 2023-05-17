import { Actors, Genres, Movies } from "../Models/models.js";
import {
    bulkIndex,
    delIndex,
    getMachedData,
    getMovieByID,
} from "../Search/util.js";
import {
    getMovieDetailsById,
    getMovieIDSWithMatch,
    getMovieIdsFromGenresWithMatch,
    getMovieIdsFromActossWithMatch,
    getUniqueDataFromModel,
    getGenres,
    getByGenre,
    getUserId,
    getMovieRating,
    getMovies,
} from "./Util/dbutil.js";
import rating_queue from "./rating_queue.js";

import dotenv from "dotenv";
dotenv.config("../.env");

const IS_SEARCH_ENABLE = process.env.IS_SEARCH_ENABLE == "true" ? true : false;

let fieldToModel = {
    Movie_Id: Movies,
    Poster_Link: Movies,
    Series_Title: Movies,
    Viedo_Link: Movies,
    Released_Year: Movies,
    Certificate: Movies,
    Runtime: Movies,
    Director: Movies,
    Overview: Movies,
    Gross: Movies,
    Genres: Genres,
    Actors: Actors,
};

function comp(a, b) {
    return b.AvgRating - a.AvgRating;
}

export async function getHomeFeed(_genre, offset, limit) {
    let home_fields = ["Movie_Id", "Poster_Link", "Series_Title"];
    let data = {};
    let genres;
    if (_genre == "all") {
        genres = await getGenres();
    } else {
        genres = await getByGenre(_genre);
    }
    for (let genre of genres) {
        let details_array = [];
        let movies = await genre.getMovies({
            offset: offset,
            limit: limit,
        });
        for (let movie of movies) {
            let details_obj = {};
            home_fields.forEach((field) => {
                details_obj[field] = movie[field];
            });
            details_obj["AvgRating"] = await getMovieRating(
                details_obj["Movie_Id"]
            );
            details_array.push(details_obj);
        }
        data[genre.Genres] = details_array;
    }
    return data;
}

export async function getMovieMeta(id) {
    // if (IS_SEARCH_ENABLE && isIndex) {
    //     return await getMovieByID(process.env.ELASTIC_SEARCH_INDEX, id);
    // } else {

    // }
    id = String(id);
    let data = await getMovieDetailsById(id);
    let tempData = {};

    let fileds = [
        "Movie_Id",
        "Poster_Link",
        "Viedo_Link",
        "Series_Title",
        "Released_Year",
        "Certificate",
        "Runtime",
        "Overview",
        "Director",
        "Gross",
    ];

    if (data) {
        fileds.forEach((field) => {
            tempData[field] = data[field];
        });
        tempData["AvgRating"] = await getMovieRating(data["Movie_Id"]);
        tempData["Genres"] = data.getGenres();
        tempData["Actors"] = data.getActors();
    }
    return tempData;
}

export async function getSearchData(text, field, offset, limit) {
    if (IS_SEARCH_ENABLE) {
        let searchData = await getMachedData(
            process.env.ELASTIC_SEARCH_INDEX,
            field,
            text,
            offset,
            limit
        );
        let data = [];
        for (let source of searchData) {
            data.push(source._source);
        }
        return data;
    } else {
        let matched_ids_array = [];
        if (fieldToModel[field] && fieldToModel[field].name == Movies.name) {
            let matched_ids = await getMovieIDSWithMatch(
                text,
                field,
                offset,
                limit
            );
            matched_ids.forEach((movie) => {
                matched_ids_array.push(movie.Movie_Id);
            });
        } else if (
            fieldToModel[field] &&
            fieldToModel[field].name == Genres.name
        ) {
            let matched_genres = await getMovieIdsFromGenresWithMatch(
                text,
                field
            );
            let matched_ids = await matched_genres.getMovies({
                attributes: ["Movie_Id"],
                offset: offset,
                limit: limit,
            });
            matched_ids.forEach((movie) => {
                matched_ids_array.push(movie.Movie_Id);
            });
        } else if (
            fieldToModel[field] &&
            fieldToModel[field].name == Actors.name
        ) {
            let matched_actors = await getMovieIdsFromActossWithMatch(
                text,
                field
            );
            let matched_ids = await matched_actors.getMovies({
                attributes: ["Movie_Id"],
                offset: offset,
                limit: limit,
            });
            matched_ids.forEach((movie) => {
                matched_ids_array.push(movie.Movie_Id);
            });
        }
        let data = [];
        for (let id of matched_ids_array) {
            const movies_details = await getMovieMeta(id);
            data.push(movies_details);
        }
        return data.sort(comp);
    }
}

export async function getUniqueData(field) {
    let data = await getUniqueDataFromModel(fieldToModel[field], field);
    let res_array = [];
    data.forEach((res) => {
        if (res.DISTINCT) {
            res_array.push(res.DISTINCT);
        }
    });
    return res_array;
}

export async function postRating(username, movie_id, rating) {
    let user_id = await getUserId(username);
    rating_queue.add({
        User_Id: user_id,
        Movie_Id: movie_id,
        Rating: rating,
    });
    return true;
}

export async function reIndexMovieDetails() {
    await delIndex(process.env.ELASTIC_SEARCH_INDEX);

    let offset = 0;
    let limit = 100;
    while (true) {
        let movies = await getMovies(offset, limit);
        if (movies.length == 0) {
            break;
        }
        let doc = [];
        for (let movie of movies) {
            let id = movie.Movie_Id;
            let movie_data = await getMovieMeta(id);
            doc.push(movie_data);
        }
        let isIndexed = await bulkIndex(process.env.ELASTIC_SEARCH_INDEX, doc);
        if (isIndexed) {
            console.log(
                "ReIndex :: indexed count: " + (offset + movies.length)
            );
            offset += limit;
        } else {
            console.log("Index Retry");
        }
    }
    console.log("ReIndexing Completed");
    return true;
}
