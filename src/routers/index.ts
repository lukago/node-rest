import * as express from 'express';
import {default as moviesRouter} from './movie';

const api = express.Router();

api.use('', moviesRouter);

export default api;
