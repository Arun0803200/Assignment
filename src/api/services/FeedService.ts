import { Service } from "typedi";
import {OrmRepository} from 'typeorm-typedi-extensions';
import { FeedRepository } from "../repositories/FeedRepository";
import { Feed } from "../models/FeedModel";
import { Like } from "typeorm";
import { off } from "process";
@Service()
export class FeedService {
    constructor(
        @OrmRepository() private feedRepository: FeedRepository
    ) {}

    // Create feed
    public async create(feedData: any): Promise<any> {
        return await this.feedRepository.save(feedData);
    }

    // Update feed
    public async update(id: number, feedData: Feed)  {
        feedData.id = id;
        return await this.feedRepository.save(feedData);
    }


    // Find One The feed
    public async findOne(feedData: any): Promise<any> {
        return await this.feedRepository.findOne(feedData);
    }

    // Find All The feed
    public async findAll(): Promise<any> {
        return await this.feedRepository.find();
    }

    // Find
    public async find(feedData: any): Promise<any> {
        return await this.feedRepository.find(feedData);
    }

    // List The feed
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
            return await this.feedRepository.count(condition);
        } else {
            return await this.feedRepository.find(condition);
        }
    }

    // Delete feed
    public async delete(id: number): Promise<any> {
        return await this.feedRepository.delete(id);
    }
}
