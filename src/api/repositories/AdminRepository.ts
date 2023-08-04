import { EntityRepository, Repository } from "typeorm";
import { Admin } from "../models/AdminModel";

@EntityRepository(Admin)
export class AdminRepository extends Repository<Admin> {}