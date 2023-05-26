import { DataTypes, Model } from "sequelize";
import sequelize_conn from "./SequelizeConn.js";

export class Movies extends Model {
    getActors() {
        let actors = [];
        this.Actors.forEach((actor) => {
            actors.push(actor.Actors);
        });
        return actors;
    }
    getGenres() {
        let genres = [];
        this.Genres.forEach((genre) => {
            genres.push(genre.Genres);
        });
        return genres;
    }
}

Movies.init(
    {
        Movie_Id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        Poster_Link: { type: DataTypes.STRING, allowNull: false },
        Series_Title: { type: DataTypes.STRING, allowNull: false },
        Viedo_Link: { type: DataTypes.STRING, allowNull: false },
        Released_Year: { type: DataTypes.INTEGER },
        Certificate: { type: DataTypes.STRING },
        Runtime: { type: DataTypes.FLOAT },
        Director: { type: DataTypes.STRING },
        Overview: { type: DataTypes.TEXT },
        Gross: { type: DataTypes.STRING },
    },
    {
        sequelize: sequelize_conn,
        tableName: "movies",
        modelName: "Movie",
        timestamps: false,
    }
);
