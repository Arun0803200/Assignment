import { Service } from "typedi";
import {OrmRepository} from 'typeorm-typedi-extensions';
import { LogListFileRepository } from "../repositories/LogListFileRepository";
import { LogListFile } from "../models/LogListFileModel";
import { Like } from "typeorm";
@Service()
export class LogListFileService {
    constructor(
        @OrmRepository() private logListFileRepository: LogListFileRepository
    ) {}

    // Create Log List File
    public async create(logData: any): Promise<any> {
        return await this.logListFileRepository.save(logData);
    }

    // Update Log List File
    public async update(id: number, logData: LogListFile)  {
        logData.id = id;
        return await this.logListFileRepository.save(logData);
    }


    // Find One The Log List File
    public async findOne(logData: any): Promise<any> {
        return await this.logListFileRepository.findOne(logData);
    }

    // Find All The Log List File
    public async findAll(): Promise<any> {
        return await this.logListFileRepository.find();
    }

    // Find Log List File
    public async find(data: any): Promise<any> {
        return await this.logListFileRepository.find(data);
    }

    // List The Log List File
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
            return await this.logListFileRepository.count(condition);
        } else {
            return await this.logListFileRepository.find(condition);
        }
    }

    // Delete Log List File
    public async delete(id: number): Promise<any> {
        return await this.logListFileRepository.delete(id);
    }
}