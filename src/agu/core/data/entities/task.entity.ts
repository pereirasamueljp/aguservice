import { Entity, Column, PrimaryGeneratedColumn, Unique, PrimaryColumn } from 'typeorm';


@Entity()
@Unique('unique_id', ['id'])
export class Task {
    @PrimaryColumn()
    @PrimaryGeneratedColumn('increment', { name: 'id' })
    id?: number;

    @Column({ name: 'title', nullable: false, length: 255 })
    title: string;

    @Column({ name: 'description', nullable: false, type: 'mediumtext'})
    description: string;

    @Column({ default: false ,nullable: true})
    inProgress: boolean;

    @Column({ default: false ,nullable: true})
    done: boolean;

    @Column({ name: 'date', nullable: true, length: 10 })
    date?: string;

    @Column({ type: 'timestamp', nullable: true })
    deleted?: Date;

    @Column({ type: 'timestamp', default: () => 'current_timestamp', onUpdate: 'current_timestamp', nullable: true })
    altered?: Date;

    @Column({ type: 'timestamp', default: () => 'current_timestamp', nullable: true })
    created?: Date;
}