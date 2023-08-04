const cron = require('node-cron');
import Container from "typedi";
import { MicroframeworkLoader, MicroframeworkSettings } from "microframework";
import { SuperAdminController } from "../common/index.controller";
export const cornLoader: MicroframeworkLoader = (settings: MicroframeworkSettings) => {
    const superAdmin = Container.get<SuperAdminController>(SuperAdminController)
    cron.schedule('*/5 * * * *', async() => {
        await superAdmin.writeLogFile(); // Function runs in every 5 minutes 
      });
}