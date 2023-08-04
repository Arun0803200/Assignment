import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate} from "typeorm";
import * as moment from 'moment';
import { BaseModel } from './BaseModel';

@Entity('admin_feed')
export class AdminFeed extends BaseModel {
    @PrimaryGeneratedColumn({name: 'id'})
    public id: number;

    @Column({name: 'admin_id'})
    public adminId: number;

    @Column({name: 'feed_id'})
    public feedId: number

    @BeforeInsert()
    public async createData(): Promise<any> {
        this.createdDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }
    @BeforeUpdate()
    public async updateData(): Promise<any> {
        this.modifiedDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }
}