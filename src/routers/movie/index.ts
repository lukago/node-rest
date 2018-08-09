import * as express from 'express';
import {MoviesRoute} from './moviesRoute';

const movie = express.Router();

movie.use('', new MoviesRoute().getRoutes());

export default movie;
