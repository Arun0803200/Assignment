import { MicroframeworkLoader, MicroframeworkSettings } from "microframework";
import * as express from 'express';

export const homeLoader: MicroframeworkLoader = async (settings: MicroframeworkSettings) => {
    if (settings) {
        const expressApp = settings.getData('expressApp');
        expressApp.get(process.env.APP_ROUTE_PREFIX, (req: express.request, res: express.response) => {
            return res.json({
                name: 'assignment',
                ersion: 'V1.0.1'
            })
        })
    }
}
