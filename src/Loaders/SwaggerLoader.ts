import { MicroframeworkLoader, MicroframeworkSettings  } from "microframework";
import {Application} from 'express';
export const swaggerLoader: MicroframeworkLoader = (settings: MicroframeworkSettings) => {
    const swaggerUi = require('swagger-ui-express');
    const swaggerFile = '../api/swagger.json';
    const requireSwagger = require(swaggerFile);
    const expressApp: Application = settings.getData('expressApp');
    expressApp.use('/swagger', swaggerUi.serve, swaggerUi.setup(requireSwagger))
}