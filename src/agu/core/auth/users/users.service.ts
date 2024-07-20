import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { Repository } from 'typeorm';

import { User } from '../../data/entities/user.entity';
import { NewUser } from '../../models/new-user';



@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    protected async generateHash(senha: string) {
        let hashed = await hash(senha, Number(process.env.SALT));
        return hashed
    }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    findOneByEmail(email: string): Promise<User> {
        return this.usersRepository.findOneBy({ email });
    }

    findOneById(id: number) {
        return this.usersRepository.findOneBy({ id });
    }

    async update(user: NewUser) {
        let { id, credentials, email, name, lastName, admin } = user
        if(credentials){
            let hash = await this.generateHash(credentials + process.env.HASH_KEY)
            await this.usersRepository.update({id},{ id, email, hash , name, lastName, admin});
        } else {
            await this.usersRepository.update({id},{ id, email, name, lastName, admin});
        }
    }

    async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }

    async save(user: NewUser): Promise<User> {
        let { credentials, email, name, lastName, admin } = user
        let hash = await this.generateHash(credentials + process.env.HASH_KEY)
        return await this.usersRepository.save({ email, hash, name, lastName, admin })
    }
}




