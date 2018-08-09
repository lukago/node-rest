import {Request, Response, Router} from 'express';
import * as request from 'request';

import {IComment, IMovie, Movie} from '../../models/movie';
import {BaseRoute} from '../baseRoute';
import * as mongoose from 'mongoose';

export class MoviesRoute extends BaseRoute {

    public addMovieAction(router: Router): void {
        router.post('', (req: Request, res: Response) => {
            let title = req.body.title;
            let url = `http://www.omdbapi.com/?apikey=${process.env.API_KEY}&t=${title}`;

            request(url, (err, resp, body) => {
                const movie = new Movie(JSON.parse(body) as IMovie);

                Movie.findById(movie.imdbID, (err, mov) => {
                    if (err) {
                        this.logger.error(err.toString());
                        res.status(500);
                        res.json({
                            success: false,
                            message: 'something went wrong.'
                        });
                    } else if (!mov) {
                        Movie.addMovie(movie, (err, movie) => {
                            if (err) {
                                this.logger.error(err.toString());
                                res.status(500);
                                res.json({
                                    success: false,
                                    message: 'something went wrong.'
                                });
                            } else {
                                this.logger.info('Movie added.');
                                res.json({
                                    success: true,
                                    message: 'movie added succesfully.'
                                });
                            }
                        });
                    } else {
                        res.status(400);
                        res.json({
                            success: false,
                            message: 'this movie has already been added.'
                        });
                    }
                });
            });
        });
    }

    public getMoviesAction(router: Router): void {
        router.get('', (req: Request, res: Response) => {
            Movie.find({}, (err, movies) => {
                res.send(movies);
            });
        });
    }

    public getMovieAction(router: Router): void {
        router.get('/:id', (req: Request, res: Response) => {
            Movie.findById(req.params.id, (err, movie) => {
                res.send(movie);
            });
        });
    }

    public addMovieCommentAction(router: Router): void {
        router.post('/comments', (req: Request, res: Response) => {
            let movieId = req.body.id;

            Movie.findById(movieId, (err: any, mov: IMovie) => {
                if (err) {
                    this.logger.error(err.toString());
                    res.status(500);
                    res.json({
                        success: false,
                        message: 'something went wrong.'
                    });
                } else if (mov) {
                    let comment: IComment = {
                        id: mongoose.Types.ObjectId().toHexString(),
                        Value: req.body.Value
                    };

                    mov.Comments.push(comment);

                    mov.save((err, movie) => {
                        if (err) {
                            this.logger.error(err.toString());
                            res.status(500);
                            res.json({
                                success: false,
                                message: 'something went wrong.'
                            });
                        } else {
                            this.logger.info('Comment added.');
                            res.json({
                                success: true,
                                message: 'movie comment added succesfully.',
                                comment: comment
                            });
                        }
                    });
                } else {
                    res.status(400);
                    res.json({
                        success: false,
                        message: 'movie does not exist.'
                    });
                }
            });
        });
    }

    public getCommentsAction(router: Router): void {
        router.get('/comments', (req: Request, res: Response) => {
            let comments: IComment[] = [];
            Movie.find({}, (err: any, movies: IMovie[]) => {
                movies.forEach(movie => comments.push(...movie.Comments));
                res.send(comments);
            });
        });
    }

    public getCommentsForMovieAction(router: Router): void {
        router.get('/:movieId/comments', (req: Request, res: Response) => {
            Movie.findById(req.params.movieId, (err: any, movie: IMovie) => {
                res.send(movie.Comments);
            });
        });
    }
}
