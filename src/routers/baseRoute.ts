import {Router} from 'express';
import * as winston from 'winston';

export abstract class BaseRoute {

    router: Router;
    logger: any;
    guard: any;
    private readonly _registeredMethodEnding: string = 'Action';

    constructor() {
        this.logger = winston;
        this.onInit();
        this.router = Router();
        this.initRoutes();
    }

    public getRoutes(): Router {
        return this.router;
    }

    getRouterMethodNames(obj: any): Set<string> {
        let methods = new Set();
        while (obj = Reflect.getPrototypeOf(obj)) {
            let keys = Reflect.ownKeys(obj);
            keys.forEach((k) => {
                if (k.toString().indexOf(this._registeredMethodEnding,
                        (k.toString().length - this._registeredMethodEnding.length)) !== -1) {
                    methods.add(k);
                }
            });
        }
        return methods;
    }

    protected onInit(): void {
    }

    private initRoutes(): void {
        const methods = this.getRouterMethodNames(this);
        [...methods].map((method) => {
            this[method](this.router);
        });
    }
}
