import * as dotenv from 'dotenv';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';

import {default as routers} from './routers';

class App {

    public express: express.Application;

    constructor() {
        this.setEnvironment();
        this.express = express();
        this.database();
        this.middleware();
        this.routes();
    }

    public database(): void {
        mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
        mongoose.connection.on('error', () => {
            console.log('MongoDB connection error. Please make sure MongoDB is running.');
            process.exit();
        });
    }

    private middleware(): void {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({extended: false}));
        this.express.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*'); // dev only
            res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,POST,DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            if (req.method === 'OPTIONS') {
                res.status(200).send();
            } else {
                next();
            }
        });
    }

    private setEnvironment(): void {
        dotenv.config({path: '.env'});
    }

    private routes(): void {
        this.express.use('/v1', routers);
        this.express.use('/', (req, res) => {
            res.status(404).send({error: `path doesn't exist`});
        });
    }

}

export default new App().express;
