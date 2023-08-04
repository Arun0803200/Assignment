import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToMany } from "typeorm";
import { BaseModel } from "./BaseModel";
import * as moment from 'moment';

export enum Roles {
    'Super Admin',
    'Admin',
    'User'
}

@Entity('log_tbl')
export class Log extends BaseModel {
    @PrimaryGeneratedColumn({name: 'id'})
    public id: number;

    @Column({name: 'name'})
    public name: string;

    @Column({name:'role'})
    public role: string;

    @Column({name: 'action'})
    public action: string;

    @Column({name: 'action_by'})
    public actionBy: string;

    @Column({name: 'action_by_role'})
    public actionByRole: string;

    @BeforeInsert()
    public async creatData(): Promise<any> {
        this.createdDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }

    @BeforeUpdate()
    public async modifiedData(): Promise<any> {
        this.modifiedDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }
}
