import logger from "../Logging/util.js";
import search from "./search_client.js";

let fieldToSearch = {
    Movie_Id: "Movie_Id",
    Poster_Link: "Poster_Link",
    Series_Title: "Series_Title",
    Viedo_Link: "Viedo_Link",
    Released_Year: "Released_Year",
    Certificate: "Certificate",
    Runtime: "Runtime",
    Director: "Director",
    Overview: "Overview",
    Gross: "Gross",
    Genres: "Genres",
    Actors: "Actors",
};

export async function bulkIndex(index, documets) {
    const operations = documets.flatMap((doc) => [
        { index: { _index: index, _id: doc.Movie_Id } },
        doc,
    ]);

    let bulkResp = await search.bulk({ refresh: true, operations });
    if (bulkResp.errors) {
        return false;
    }
    return true;
}

export async function delIndex(index) {
    try {
        await search.indices.delete({ index: index });
    } catch (err) {
        logger.info("Index not exist :: " + err);
        // console.log("Index not exist :: " + err);
    } finally {
        await search.indices.create({ index: index });
    }
}

export async function updateValueInIndex(index, movie_id, field, value) {
    await search.update({
        index: index,
        id: movie_id,
        doc: {
            [field]: value,
        },
    });
}

export async function getMachedData(index, field, text, offset, limit) {
    field = fieldToSearch[field];
    let searchData = await search.search({
        index: index,
        from: offset,
        size: limit,

        query: {
            match_bool_prefix: {
                [field]: text,
            },
        },
        sort: [{ AvgRating: "desc" }],
    });
    return searchData.hits.hits;
}

export async function getMovieByID(index, id) {
    let movie = await search.get({
        index: index,
        id: id,
    });
    return movie._source;
}
