import {Document, Model, model, Schema} from 'mongoose';

export interface IRating {
    Source: string;
    Value: string;
}

export interface IComment {
    id: string;
    Value: string;
}

export interface IMovie extends Document {
    imdbID: string;
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    Poster: string;
    Ratings: IRating[];
    Metascore: string;
    imdbRating: string;
    imdbVotes: string;
    Type: string;
    DVD: string;
    BoxOffice: string;
    Production: string;
    Website: string;
    Response: string;
    Comments: IComment[];
}

export interface IMovieModel {
    addMovie(movie: IMovie, callback: Function): void;

    findById(id: string, callback: Function): void;
}

const userSchema = new Schema({
    imdbID: {
        type: String,
        required: true
    },
    Title: {
        type: String,
        required: true
    },
    Year: {
        type: String
    },
    Rated: {
        type: String
    },
    Released: {
        type: String
    },
    Runtime: {
        type: String
    },
    Genre: {
        type: String
    },
    Director: {
        type: String
    },
    Writer: {
        type: String
    },
    Actors: {
        type: String
    },
    Plot: {
        type: String
    },
    Language: {
        type: String
    },
    Country: {
        type: String
    },
    Awards: {
        type: String
    },
    Poster: {
        type: String
    },
    Ratings: {
        type: Array,
        items: {
            type: Object,
            properties: {
                Source: {
                    type: String
                },
                Value: {
                    type: String
                }
            }
        }
    },
    Comments: {
        type: Array,
        items: {
            type: Object,
            properties: {
                id: {
                    type: String,
                    required: true
                },
                Value: {
                    type: String,
                    required: true
                }
            }
        }
    },
    Metascore: {
        type: String
    },
    imdbRating: {
        type: String
    },
    imdbVotes: {
        type: String
    },
    Type: {
        type: String
    },
    DVD: {
        type: String
    },
    BoxOffice: {
        type: String
    },
    Production: {
        type: String
    },
    Website: {
        type: String
    },
    Response: {
        type: String
    }
});

userSchema.static('addMovie', (movie, callback) => {
    movie.save(callback);
});

userSchema.static('findById', (id, callback) => {
    Movie.findOne({imdbID: id}, callback);
});

export type MovieModel = Model<IMovie> & IMovieModel & IMovie;

export const Movie: MovieModel = <MovieModel>model<IMovie>('Movie', userSchema);
