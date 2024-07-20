import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../../core/data/entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService {

    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
    ) { }


    findAll(): Promise<Task[]> {
        return this.taskRepository.find();
    }

    findOne(id: number): Promise<Task> {
        return this.taskRepository.findOneBy({id});
    }

    async delete(id: number): Promise<void> {
        await this.taskRepository.delete({id});
    }

    async save(user: Task): Promise<Task> {
        return await this.taskRepository.save(user)
    }
}




