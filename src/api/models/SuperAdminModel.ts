import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('super_admin')
export class SuperAdmin {
    @PrimaryGeneratedColumn({name: 'id'})
    public id: number;

    @Column({name: 'name'})
    public name: string;

    @Column({name: 'role'})
    public role: string;

    @Column({name: 'email'})
    public email: string;

    @Column({name: 'password'})
    public password: string
}