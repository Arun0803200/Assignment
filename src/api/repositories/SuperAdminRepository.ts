import { EntityRepository, Repository } from "typeorm";
import { SuperAdmin } from "../models/SuperAdminModel";

@EntityRepository(SuperAdmin)
export class SuperAdminRepository extends Repository<SuperAdmin> {}
