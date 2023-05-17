import { Sequelize, DataTypes, Model } from "sequelize";
import dotenv from "dotenv";
dotenv.config("../.env");

export let sequelize = new Sequelize(process.env.DATABASE_CONN_URI, {
    pool: {
        max: 10,
    },
    logging: false,
});

(async function () {
    try {
        await sequelize.authenticate();
        console.log("Database connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database :: ", error);
    }
})();

export class Users extends Model {}
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
export class Actors extends Model {}
export class Genres extends Model {}
export class User_Rating extends Model {}
export class Movies_Actors extends Model {}
export class Movies_Genres extends Model {}

Users.init(
    {
        User_Id: {
            type: DataTypes.SMALLINT,
            primaryKey: true,
            autoIncrement: true,
        },
        User_Name: { type: DataTypes.TEXT, allowNull: false, unique: true },
        User_Email: { type: DataTypes.TEXT, allowNull: false },
        User_Password: { type: DataTypes.TEXT, allowNull: false },
    },
    {
        sequelize,
        tableName: "users",
        modelName: "User",
        timestamps: true,
    }
);

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
        sequelize,
        tableName: "movies",
        modelName: "Movie",
        timestamps: false,
    }
);

Actors.init(
    {
        Actor_Id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        Actors: { type: DataTypes.STRING, allowNull: false },
    },
    {
        sequelize,
        tableName: "actors",
        modelName: "Actor",
        timestamps: false,
    }
);

Genres.init(
    {
        Genre_Id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        Genres: { type: DataTypes.STRING, allowNull: false },
    },
    {
        sequelize,
        tableName: "genre",
        modelName: "Genre",
        timestamps: false,
    }
);

User_Rating.init(
    {
        User_Id: {
            type: DataTypes.SMALLINT,
        },
        Movie_Id: {
            type: DataTypes.INTEGER,
        },
        Rating: {
            type: DataTypes.FLOAT,
        },
    },
    {
        sequelize,
        tableName: "user_rating",
        modelName: "User_Rating",
        timestamps: true,
    }
);

Movies_Actors.init(
    {
        Movie_Id: {
            type: DataTypes.INTEGER,
            unique: false,
        },
        Actor_Id: {
            type: DataTypes.INTEGER,
            unique: false,
        },
    },
    {
        sequelize,
        tableName: "movies_actors",
        modelName: "Movie_Actor",
        timestamps: false,
    }
);

Movies_Genres.init(
    {
        Movie_Id: {
            type: DataTypes.INTEGER,
            unique: false,
        },
        Genre_Id: {
            type: DataTypes.INTEGER,
            unique: false,
        },
    },
    {
        sequelize,
        tableName: "movies_genre",
        modelName: "Movie_Genre",
        timestamps: false,
    }
);

Movies.belongsToMany(Users, { through: User_Rating, foreignKey: "Movie_Id" });
Users.belongsToMany(Movies, { through: User_Rating, foreignKey: "User_Id" });

Movies.belongsToMany(Genres, {
    through: Movies_Genres,
    foreignKey: "Movie_Id",
});
Genres.belongsToMany(Movies, {
    through: Movies_Genres,
    foreignKey: "Genre_Id",
});

Movies.belongsToMany(Actors, {
    through: Movies_Actors,
    foreignKey: "Movie_Id",
});
Actors.belongsToMany(Movies, {
    through: Movies_Actors,
    foreignKey: "Actor_Id",
});

async function main() {
    await Users.sync({ alter: true });
    await Movies.sync({ alter: true });
    await Actors.sync({ alter: true });
    await Genres.sync({ alter: true });
    await User_Rating.sync({ alter: true });
    await Movies_Actors.sync({ alter: true });
    await Movies_Genres.sync({ alter: true });
}
main();
