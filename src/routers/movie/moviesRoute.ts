import {Request, Response, Router} from 'express';
import * as request from 'request';

import {IComment, IMovie, Movie} from '../../models/movie';
import {BaseRoute} from '../baseRoute';
import * as mongoose from 'mongoose';
import {check, validationResult} from 'express-validator/check';

export class MoviesRoute extends BaseRoute {

    public addMovieAction(router: Router): void {
        router.post('/movies', [
                check('title').exists().isString()
            ], (req: Request, res: Response) => {

            const errors = validationResult(req);
            if (!validationResult(req).isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }

            let title = req.body.title;
            let url = `http://www.omdbapi.com/?apikey=${process.env.API_KEY}&t=${title}`;

            request(url, (err, resp, body) => {
                const movie = new Movie(JSON.parse(body) as IMovie);

                Movie.findById(movie.imdbID, (err, mov) => {
                    if (err) {
                        this.logger.error(err.toString());
                        this.setResponse(res, 'something went wrong', 500);
                    } else if (!mov) {
                        Movie.addMovie(movie, (err, movie) => {
                            if (err) {
                                this.logger.error(err.toString());
                                this.setResponse(res, 'something went wrong', 500);
                            } else {
                                this.logger.info('movie added');
                                this.setResponse(res, 'movie added succesfully');
                            }
                        });
                    } else {
                        this.setResponse(res, 'this movie has already been added', 400);
                    }
                });
            });
        });
    }

    public getMoviesAction(router: Router): void {
        router.get('/movies', (req: Request, res: Response) => {
            Movie.find({}, (err, movies) => {
                if (!movies) {
                    movies = [];
                }

                res.send(movies);
            });
        });
    }

    public getMovieAction(router: Router): void {
        router.get('/movies/:id', (req: Request, res: Response) => {
            Movie.findById(req.params.id, (err, movie) => {
                if (!movie) {
                    this.setResponse(res, 'movie does not exist', 404);
                    return false;
                }

                res.send(movie);
            });
        });
    }

    public addMovieCommentAction(router: Router): void {
        router.post('/comments', [
            check('id').exists().isString(),
            check('value').exists().isString()
        ], (req: Request, res: Response) => {

            const errors = validationResult(req);
            if (!validationResult(req).isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }

            let movieId = req.body.id;

            Movie.findById(movieId, (err: any, mov: IMovie) => {
                if (err) {
                    this.logger.error(err.toString());
                    this.setResponse(res, 'something went wrong', 500);
                } else if (mov) {
                    let comment: IComment = {
                        id: mongoose.Types.ObjectId().toHexString(),
                        Value: req.body.value
                    };

                    mov.Comments.push(comment);

                    mov.save((err, movie) => {
                        if (err) {
                            this.logger.error(err.toString());
                            this.setResponse(res, 'something went wrong', 500);
                        } else {
                            this.logger.info('comment added.');
                            res.json({
                                success: true,
                                message: 'movie comment added succesfully',
                                comment: comment
                            });
                        }
                    });
                } else {
                    this.setResponse(res, 'movie does not exist', 404);
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
        router.get('/comments/:movieId', (req: Request, res: Response) => {
            Movie.findById(req.params.movieId, (err: any, movie: IMovie) => {
                if (!movie) {
                    this.setResponse(res, 'movie does not exist', 404);
                    return false;
                }

                res.send(movie.Comments);
            });
        });
    }

    private setResponse(res: Response, message: string, code: number = 200): void {
        if (code !== 200) {
            res.status(code);
        }
        res.json({
            success: code === 200,
            message: message
        });
    }
}
