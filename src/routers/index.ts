import * as express from 'express';
import {default as moviesRouter} from './movie';

const api = express.Router();

api.use('/movies', moviesRouter);

export default api;
