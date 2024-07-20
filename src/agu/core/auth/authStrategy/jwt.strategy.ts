import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { decode } from 'jsonwebtoken';
import { JwtToken } from '../../interface/jwt-token.interface';
import { UsersService } from '../users/users.service';
import { Session } from '../../middleware/session.middleware';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService
    ) {
        super({
            passReqToCallback: true,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKeyProvider: async (request, rawJwtToken, done) => {
                const decoded = decode(rawJwtToken) as JwtToken;
                if (!decoded) { throw done(new UnauthorizedException('Token inválido')); }
                const user = await this.usersService.findOneByEmail(decoded.email);
                if (!user) { return done(new UnauthorizedException('Usuário não encontrado!')); }
                done(null, `${process.env.JWT_KEY}-${user.hash}`);
            },
        });
    }

    async validate(req: Request, payload: JwtToken, a: any) {
        const authInfo = await this.authService.validateUser(payload);
        if (!authInfo) {
            throw new ForbiddenException();
        }
        Session.set('authInfo', authInfo);
        return authInfo;
    }
}