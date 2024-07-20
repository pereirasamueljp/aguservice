import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../../core/data/entities/task.entity'

import { SocketModule } from '../socket/socket.module';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';


@Module({
  imports: [TypeOrmModule.forFeature([Task]),SocketModule],
  providers: [TaskService],
  exports: [TypeOrmModule],
  controllers: [TaskController],
})
export class TaskModule {}