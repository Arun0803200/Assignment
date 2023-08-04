import {MicroframeworkLoader, MicroframeworkSettings} from 'microframework'
import {Application} from 'express';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import {useExpressServer} from 'routing-controllers';
import * as controllerIndex from '../common/index.controller';
import { authorizationChecker } from '../authorization/AuthorizationChecker';


export const expressLoader: MicroframeworkLoader =  (settings: MicroframeworkSettings) => {
    if (settings) {
        const app = express();
        app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
        app.use(bodyParser.json({limit: '50mb'}));
        const connection = settings.getData('connection');
        const expressApp: Application = useExpressServer(app, {
            cors: true,
            routePrefix: process.env.APP_ROUTE_PREFIX,
            defaultErrorHandler: true,
            classTransformer: true,
            controllers: Object.values(controllerIndex),
            authorizationChecker: authorizationChecker(connection),
        });        
        const expressServer = expressApp.listen(process.env.APP_PORT);
        settings.setData('expressApp', expressApp);
        settings.setData('expressServer', expressServer);
     }
}
