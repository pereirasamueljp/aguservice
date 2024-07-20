import { ForbiddenException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { compare} from 'bcryptjs';
import { AuthData } from '../../models/authData';
import { decode, sign, verify } from 'jsonwebtoken';
import { JwtToken } from '../../interface/jwt-token.interface';
import { UserData } from '../../interface/userData';
import { TokenResult } from '../../models/tokenResult';
import { UsersService } from '../users/users.service';
import * as moment from 'moment'

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
    ) { }

    async validaTokenSocket(rawJwtToken: string): Promise<AuthData> {
        const decoded = decode(rawJwtToken) as JwtToken;
        if (!decoded) { throw new UnauthorizedException('Token inválido'); }
        const user = await this.usersService.findOneByEmail(decoded.email);
        if (!user) { throw new UnauthorizedException('Usuário não encontrado!'); }
        const secret = `${process.env.JWT_KEY}-${user.hash}`;
        const jwtToken = verify(rawJwtToken, secret) as JwtToken;
        return this.validateUser(jwtToken);
    }

    async validateUser(token: JwtToken): Promise<AuthData> {
        let dataUser: UserData;

        dataUser = await this.usersService.findOneByEmail(token.email);

        if (!dataUser) { return null; }

        if (!dataUser.active) {
            throw new ForbiddenException('Usuário inativo!');
        }
        if (dataUser.deleted) {
            throw new ForbiddenException('Usuário removido');
        }

        const result: AuthData = {
            token,
            email: dataUser.email,
            isAdmin: dataUser.admin,
        };

        return result;
    }

    async signIn(email: string, credentials: string) {
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            throw new ForbiddenException(`Usuario ${email} não encontrado.`);
        }

        await compare(credentials + process.env.HASH_KEY, user.hash).then(credentialsEqualsHash => {
            if (!credentialsEqualsHash) {
                let codeStatus = HttpStatus.BAD_REQUEST;
                if (credentials === '57b25146f4d92134635fe3a5799479261fafdd4d15a88f72e8261be1cc3f6ce8') {
                    codeStatus = HttpStatus.NOT_FOUND;
                }
                throw new HttpException('Senha incorreta!', codeStatus);
            }
            return credentialsEqualsHash
        })

        return this.generateToken(user);
    }

    protected async generateToken(userData: UserData): Promise<TokenResult> {
        const tokenData: JwtToken = {
            email: userData.email,
            admin: userData.admin,
        }

        const { token, decoded } = this.signToken(tokenData, userData.hash);

        const result: any = {
            token,
            expiresIn: moment.unix(decoded.exp).toDate()
        };
        return result;
    }

    protected signToken(tokenData: any, secret: string, expires: string = '7d') {
        const token = sign(tokenData, `${process.env.JWT_KEY}-${secret}`, { expiresIn: expires });
        const decoded = decode(token) as any;
        return { token, decoded };
    }
}