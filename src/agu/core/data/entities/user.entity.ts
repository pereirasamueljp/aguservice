import { Entity, Column, PrimaryGeneratedColumn, Unique, PrimaryColumn } from 'typeorm';


@Entity()
@Unique('unique_email', ['email'])
export class User {
    @PrimaryColumn()
    @PrimaryGeneratedColumn('increment', { name: 'id' })
    id: number;

    @Column({ name: 'email', nullable: false, length: 100 })
    email: string;

    @Column({ name: 'hash', nullable: false, length: 255 })
    hash: string;

    @Column({ name: 'name', nullable: true, length: 20 })
    name: string;

    @Column({ name: 'lastName', nullable: true, length: 20 })
    lastName: string;

    @Column({ default: false ,nullable: true})
    admin: boolean;

    @Column({ default: true ,nullable: true})
    active: boolean;

    @Column({ type: 'timestamp', nullable: true })
    deleted: Date;

    @Column({ type: 'timestamp', default: () => 'current_timestamp', onUpdate: 'current_timestamp', nullable: true })
    altered: Date;

    @Column({ type: 'timestamp', default: () => 'current_timestamp', nullable: true })
    created: Date;
}