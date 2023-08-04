import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from "typeorm";
import { BaseModel } from "./BaseModel";
import * as moment from 'moment';

@Entity('feed')
export class Feed extends BaseModel {
    @PrimaryGeneratedColumn({name: 'id'})
    public id: number;

    @Column({name: 'name'})
    public name: string;

    @Column({name: 'url'})
    public url: string;

    @Column({name: 'description'})
    public description: string;

    @BeforeInsert()
    public async createdData(): Promise<any> {
        this.createdDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }

    @BeforeUpdate()
    public async updateData(): Promise<any> {
        this.modifiedDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }
}
