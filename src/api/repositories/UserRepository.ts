import { EntityRepository, Repository } from "typeorm";
import { User } from "../models/UserModel";

@EntityRepository(User)
export class UserRepository extends Repository<User> {}
