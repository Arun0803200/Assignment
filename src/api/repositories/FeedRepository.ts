import { EntityRepository, Repository } from "typeorm";
import { Feed } from "../models/FeedModel";

@EntityRepository(Feed)
export class FeedRepository extends Repository<Feed> {}
