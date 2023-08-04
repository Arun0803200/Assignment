import { Service } from "typedi";
import {OrmRepository} from 'typeorm-typedi-extensions';
import { UserFeedRepository } from "../repositories/UserFeedRepository";
import { UserFeed } from "../models/UserFeedModel";
import { Like } from "typeorm";
import { off } from "process";
@Service()
export class UserFeedService {
    constructor(
        @OrmRepository() private userFeedRepository: UserFeedRepository
    ) {}

    // Create UserFeed
    public async create(userFeedData: any): Promise<any> {
        return await this.userFeedRepository.save(userFeedData);
    }

    // Update UserFeed
    public async update(id: number, userFeedData: UserFeed)  {
        userFeedData.id = id;
        return await this.userFeedRepository.save(userFeedData);
    }


    // Find One The UserFeed
    public async findOne(userFeedData: any): Promise<any> {
        return await this.userFeedRepository.findOne(userFeedData);
    }

    // Find
    public async find(userFeedData: any): Promise<any> {
        return await this.userFeedRepository.find(userFeedData);
    }

    // Find All The UserFeed
    public async findAll(): Promise<any> {
        return await this.userFeedRepository.find();
    }

    // List The UserFeed
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
            return await this.userFeedRepository.count(condition);
        } else {
            return await this.userFeedRepository.find(condition);
        }
    }

    // Delete UserFeed
    public async delete(id: number): Promise<any> {
        return await this.userFeedRepository.delete(id);
    }
}