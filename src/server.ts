import * as http from 'http';
import * as debug from 'debug';
import * as winston from 'winston';
import App from './app';

class Server {

    private static serverInstance: Server;
    private server: any;
    private port: number;

    public constructor() {
        this.debugMod();
        this.runServer();
    }

    public static bootstrap(): Server {
        if (!this.serverInstance) {
            this.serverInstance = new Server();
            return this.serverInstance;
        } else {
            return this.serverInstance;
        }

    }

    public getServerInstance(): any {
        return this.server;
    }

    private debugMod(): void {
        debug('ts-express:server');
        winston.add(winston.transports.File, { filename: 'application.log' });
    }

    private runServer(): void {
        this.port = this.normalizePort(process.env.PORT);
        App.set('port', this.port);
        this.createServer();
    }

    private createServer(): void {
        this.server = http.createServer(App);
        this.server.listen(this.port);

        this.server.on('listening', () => {
            let address = this.server.address();
            let bind = (typeof address === 'string') ? `pipe ${address}` : `port ${address.port}`;
            debug(`Listening on ${bind}`);
        });

        this.server.on('error', (error: NodeJS.ErrnoException) => {
            if (error.syscall !== 'listen') {
                throw error;
            }
            console.error(error);
            process.exit(1);
        });
    }

    private normalizePort(val: number | string): number {
        return (typeof val === 'string') ? parseInt(val, 10) : val;
    }

}

export const server = Server.bootstrap();
