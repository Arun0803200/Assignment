import { MicroframeworkSettings, MicroframeworkLoader } from "microframework";
import { Token } from "../api/models/Token";
import { getConnectionOptions, createConnection } from "typeorm";
import * as Migration from "../../src/common/index.migration";
import * as models from "../../src/common/index.entity";
export const typeormLoader: MicroframeworkLoader = async (settings: MicroframeworkSettings) => {  
    const loaderOption: any = await getConnectionOptions();    
    const connectionOptions: any = Object.assign(loaderOption, {
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        database: 'test_assignment',
        password: '',
        synchronize: false,
        logging: true,
        entities: Object.values(models),
        migrations: Object.values(Migration),
        cli: {
            migrationsDir: './src/database/Migrations'
        }
    });
    const connection = await createConnection(connectionOptions)    
    connection.runMigrations();
    if (settings) {
        settings.setData('connection', connection)
    }
}
