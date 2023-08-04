import { EntityRepository, Repository } from "typeorm";
import { UserFeed } from "../models/UserFeedModel";
@EntityRepository(UserFeed)
export class UserFeedRepository extends Repository<UserFeed> {}
