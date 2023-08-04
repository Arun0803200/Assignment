import { Service } from "typedi";
import {OrmRepository} from 'typeorm-typedi-extensions';
import { AdminFeedRepository } from "../repositories/AdminFeedRepository";
import { AdminFeed } from "../models/AdminFeed";
import { Like } from "typeorm";
import { off } from "process";
@Service()
export class AdminFeedService {
    constructor(
        @OrmRepository() private adminFeedRepository: AdminFeedRepository
    ) {}

    // Create admin feed
    public async create(adminFeedData: any): Promise<any> {
        return await this.adminFeedRepository.save(adminFeedData);
    }

    // Update admin feed
    public async update(id: number, adminFeedData: AdminFeed)  {
        adminFeedData.id = id;
        return await this.adminFeedRepository.save(adminFeedData);
    }


    // Find One The adminFeed
    public async findOne(adminFeedData: any): Promise<any> {
        return await this.adminFeedRepository.findOne(adminFeedData);
    }

    // Find
    public async find(adminFeedData: any): Promise<any> {
        return await this.adminFeedRepository.find(adminFeedData);
    }

    // Find All The adminFeed
    public async findAll(): Promise<any> {
        return await this.adminFeedRepository.find();
    }

    // List The adminFeed
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
            return await this.adminFeedRepository.count(condition);
        } else {
            return await this.adminFeedRepository.find(condition);
        }
    }

    // Delete adminFeed
    public async delete(id: number): Promise<any> {
        return await this.adminFeedRepository.delete(id);
    }
}