import { EntityRepository, Repository } from "typeorm";
import { LogListFile } from "../models/LogListFileModel";

@EntityRepository(LogListFile)
export class LogListFileRepository extends Repository<LogListFile> {}
