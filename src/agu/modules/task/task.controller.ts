import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../../core/guard/admin.guard';
import { Task } from '../../core/data/entities/task.entity';
import { TaskService } from './task.service';
import { pick } from '../../../utils/destructurer';
import { getParams } from '../../../utils/getParams';
import { WebSocketServer } from '@nestjs/websockets';
import { AguSocket } from '../../core/interface/socket.interface';
import { SocketGateway } from '../socket/socket.gateway';
import { UserGuard } from 'src/agu/core/guard/user.guard';

interface SocketEmitter<T> {
    type: string,
    object: T,
}

@Controller('task')
export class TaskController {
    constructor(
        private readonly taskService: TaskService,
        private gateway: SocketGateway,
    ) { }

    @WebSocketServer()
    server: AguSocket;

    @UseGuards(AuthGuard('jwt'), UserGuard)
    @Post()
    public async save(@Body() task: Task) {
        let newTask = await this.taskService.save(task)
        let socketValue: SocketEmitter<Task> = {
            type: 'add',
            object: newTask,
        }
        this.gateway.socket.emit('task-list', socketValue);

        return newTask;
    }

    @UseGuards(AuthGuard('jwt'), UserGuard)
    @Put('/:id')
    public async update(@Param('id') id: number, @Body() task: Task) {
        let newTask = await this.taskService.save({ id: Number(id), ...task });
        let socketValue: SocketEmitter<Task> = {
            type: 'update',
            object: newTask,
        }
        this.gateway.socket.emit('task-list', socketValue);

        return newTask;
    }

    @UseGuards(AuthGuard('jwt'), UserGuard)
    @Delete('/:id')
    public async delete(@Param('id') id: number) {
        let response = await this.taskService.delete(id);
        let socketValue: SocketEmitter<Task> = {
            type: 'remove',
            object: {
                id: id,
                description: '',
                title: '',
                done: true,
                inProgress: true,
            },
        }
        this.gateway.socket.emit('task-list', socketValue);
        return response
    }

    @UseGuards(AuthGuard('jwt'), UserGuard)
    @Get('/:id?')
    public async getOne(@Param('id') id: number, @Query('attributes') attributesParam: string) {
        let attributes = getParams<string[]>(attributesParam);
        if (id) return pick(await this.taskService.findOne(id), attributes)
        return pick(await this.taskService.findAll(), attributes)
    }


}
