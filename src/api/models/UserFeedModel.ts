import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, ManyToOne } from "typeorm";
import { BaseModel } from "./BaseModel";
import * as moment from 'moment'
import bcrypt = require('bcrypt');
import { User } from "./UserModel";

@Entity('user_feed_table')
export class UserFeed extends BaseModel {
    @PrimaryGeneratedColumn({name: 'id'})
    public id: number;

    @Column({name: 'user_id'})
    public userId: number;

    @Column({name: 'feed_id'})
    public feedId: number;

    @BeforeInsert()
    public async createData(): Promise<any> {
        this.createdDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }
    @BeforeUpdate()
    public async updateData(): Promise<any> {
        this.modifiedDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }
}
