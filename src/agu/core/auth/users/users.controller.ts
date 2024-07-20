import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { pick } from '../../../../utils/destructurer';
import { getParams } from '../../../../utils/getParams';
import { User } from '../../data/entities/user.entity';
import { AdminGuard } from '../../guard/admin.guard';
import { UserGuard } from '../../guard/user.guard';
import { Session } from '../../middleware/session.middleware';
import { AuthData } from '../../models/authData';
import { NewUser } from '../../models/new-user';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards()
    @Post()
    public async save(@Body() newUser: NewUser) {
        try {
            await this.usersService.save(newUser);
        } catch (error) {
            return new Error('Não foi possível cadastrar o usuário')
        }
        return { message: "Cadastro realizado com sucesso!" }
    }

    @UseGuards(AuthGuard('jwt'), UserGuard)
    @Get('/self')
    public async getSelfInfo() {
        let authData: AuthData = Session.get<AuthData>('authInfo');
        let result = await this.usersService.findOneByEmail(authData.email)
        delete result.hash
        return result
    }

    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Get('/:id?')
    public async get(@Param('id') id: number, @Query('attributes') attributesParam: string, @Query('filters') filtersParam: string) {
        let attributes = getParams<string[]>(attributesParam);
        let filters = getParams<{ email: string }>(filtersParam);
        if (filters.email) {
            let result = pick(await this.usersService.findOneByEmail(filters.email), attributes) as User
            delete result.hash
            return result
        }
        if (id) return pick(await this.usersService.findOneById(id), attributes)
        return pick(await this.usersService.findAll(), attributes)
    }

    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Put('/:id')
    public async update(@Param('id') id: number, @Body() user: NewUser) {
        if (!Number(id)) return new Error('ID inválido.');
        if (!user) return new Error('Usuário inválido.');
        user.id = id;
        return this.usersService.update(user);
    }


    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Delete('/:id')
    public async delete(@Param('id') id: number) {
        if (!Number(id)) return new Error('ID inválido.');
        return this.usersService.remove(id);
    }

}
