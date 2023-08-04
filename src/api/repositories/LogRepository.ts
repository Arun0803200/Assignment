import { EntityRepository, Repository } from "typeorm";
import { Log } from "../models/LogModel";

@EntityRepository(Log)
export class LogRepository extends Repository<Log> {}
