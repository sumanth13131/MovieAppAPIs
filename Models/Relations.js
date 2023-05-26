import { Movies } from "./Movies.js";
import { Users } from "./Users.js";
import { Movies_Genres } from "./Movies_Genres.js";
import { Genres } from "./Genres.js";
import { Actors } from "./Actors.js";
import { Movies_Actors } from "./Movies_Actors.js";
import { User_Rating } from "./User_Rating.js";

export default function RelationInit() {
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
}






// async function main() {
//     await Users.sync({ alter: true });
//     await Movies.sync({ alter: true });
//     await Actors.sync({ alter: true });
//     await Genres.sync({ alter: true });
//     await User_Rating.sync({ alter: true });
//     await Movies_Actors.sync({ alter: true });
//     await Movies_Genres.sync({ alter: true });
// }
// main();