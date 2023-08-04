import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToMany } from "typeorm";
import { BaseModel } from "./BaseModel";
import * as moment from 'moment';

@Entity('log_list_file')
export class LogListFile extends BaseModel {
    @PrimaryGeneratedColumn({name: 'id'})
    public id: number;

    @Column({name: 'file_name'})
    public fileName: string;

    @BeforeInsert()
    public async creatData(): Promise<any> {
        this.createdDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }

    @BeforeUpdate()
    public async modifiedData(): Promise<any> {
        this.modifiedDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }
}
