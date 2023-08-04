import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { BaseModel } from './BaseModel';
import * as moment from 'moment';
import * as bcrypt from 'bcrypt';

@Entity('admin')
export class Admin extends BaseModel{

    public static hashPassword(password: string) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    public static comparePassword(password: any, hashPassword: Admin) {
        return new Promise((resolve, reject) => {
            bcrypt.comparePassword(password, hashPassword, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })
    }
    @PrimaryGeneratedColumn({name: 'id'})
    public id: number;

    @Column({name: 'name'})
    public name: string;

    @Column({name: 'role'})
    public role: number;

    @Column({name: 'email'})
    public email: string;

    @Column({name: 'password'})
    public password: string

    @Column({name: 'delete_flag'})
    public deleteFlag: number;

    @BeforeInsert()
    public async createData(): Promise<any> {
        this.createdDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }
    @BeforeUpdate()
    public async updateData(): Promise<any> {
        this.modifiedDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }
}