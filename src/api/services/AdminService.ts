import { Service } from "typedi";
import {OrmRepository} from 'typeorm-typedi-extensions';
import { AdminRepository } from "../repositories/AdminRepository";
import { Admin } from "../models/AdminModel";
import { Like } from "typeorm";
@Service()
export class AdminService {
    constructor(
        @OrmRepository() private adminRepository: AdminRepository
    ) {}

    // Create admin
    public async create(adminData: any): Promise<any> {
        return await this.adminRepository.save(adminData);
    }

    // Update admin
    public async update(id: number, adminData: Admin)  {
        adminData.id = id;
        return await this.adminRepository.save(adminData);
    }


    // Find One The admin
    public async findOne(adminData: any): Promise<any> {
        return await this.adminRepository.findOne(adminData);
    }

    // Find All The admin
    public async findAll(): Promise<any> {
        return await this.adminRepository.find();
    }

    // List The admin
    public async list(limit: number, offset: number, search: any = [], select: any = [], whereConditions: any = [], relation: any = [], count: number | boolean): Promise<any> {
        const condition: any = {};

        if (select && select.length > 0) {
            condition.select = select;
        }
        condition.order = {
            createdDate: 'DESC'
        }
        if (whereConditions && whereConditions.length > 0) {
            whereConditions.forEach((data) => {
                if (data.value!=='') {
                    condition.where[data.name] = data.value;
                }
            })
        }

        if (relation && relation.length > 0) {
            condition.relation;
        }

        if (search && search.length > 0) {
            search.forEach((data) => {
                const operation = data.op;
                if (operation === 'where' && data.value !== '') {
                    condition.where[data.name] = data.value;
                }
                else if (operation === 'like' && data.value !== '') {
                    condition.where[data.name] = Like('%' + data.value + '%');
                }
            })
        }

        if (limit > 0) {
            condition.take = limit;
            condition.skip = offset;
        }

        if (count) {
            return await this.adminRepository.count(condition);
        } else {
            return await this.adminRepository.find(condition);
        }
    }

    // Delete admin
    public async delete(id: number): Promise<any> {
        return await this.adminRepository.delete(id);
    }
}
