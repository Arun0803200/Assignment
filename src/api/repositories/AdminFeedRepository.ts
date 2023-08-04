import { EntityRepository, Repository } from "typeorm";
import { AdminFeed } from "../models/AdminFeed";

@EntityRepository(AdminFeed)
export class AdminFeedRepository extends Repository<AdminFeed> {}
