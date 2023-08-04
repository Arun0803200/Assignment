import { Service } from "typedi";
import {OrmRepository} from 'typeorm-typedi-extensions';
import { LogRepository } from "../repositories/LogRepository";
import { Log } from "../models/LogModel";
import { Like } from "typeorm";
import { off } from "process";
@Service()
export class LogService {
    constructor(
        @OrmRepository() private logRepository: LogRepository
    ) {}

    // Create log
    public async create(logData: any): Promise<any> {
        return await this.logRepository.save(logData);
    }

    // Update log
    public async update(id: number, logData: Log)  {
        logData.id = id;
        return await this.logRepository.save(logData);
    }


    // Find One The log
    public async findOne(logData: any): Promise<any> {
        return await this.logRepository.findOne(logData);
    }

    // Find All The log
    public async findAll(): Promise<any> {
        return await this.logRepository.find();
    }

    // List The log
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
            return await this.logRepository.count(condition);
        } else {
            return await this.logRepository.find(condition);
        }
    }

    // Delete log
    public async delete(id: number): Promise<any> {
        return await this.logRepository.delete(id);
    }
}