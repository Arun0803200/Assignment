import { bootstrapMicroframework } from "microframework";
import { diLoader } from "../src/Loaders/DiLoader";
import { typeormLoader } from "../src/Loaders/TypeormLoader";
import { expressLoader } from "../src/Loaders/ExpressLoade";
import { homeLoader } from "../src/Loaders/HomeLoader";
import { swaggerLoader } from "./Loaders/SwaggerLoader";
import { cornLoader } from "./Loaders/CronLoader";

bootstrapMicroframework({
    loaders: [
        diLoader,
        typeormLoader,
        expressLoader,
        homeLoader,
        swaggerLoader,
        cornLoader
    ]
}).then(()=>{console.log('App running.............')});