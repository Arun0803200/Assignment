import { Service } from "typedi";
import {OrmRepository} from 'typeorm-typedi-extensions';
import { SuperAdminRepository } from "../repositories/SuperAdminRepository";

@Service()
export class SuperAdminService {
    constructor(
        @OrmRepository() private superAdminRepository: SuperAdminRepository
    ) {}
    // Find One The log
    public async findOne(data: any): Promise<any> {
        return await this.superAdminRepository.findOne(data);
    }
}