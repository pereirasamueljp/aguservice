import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';


const passportModule = PassportModule.register({ defaultStrategy: 'jwt', property: 'authInfo' });

@Module({
    imports: [
        passportModule,
        HttpModule,
        UsersModule
    ],
    providers: [AuthService, JwtStrategy,UsersService],
    exports: [AuthService, passportModule]
})
export class AuthStrategyModule {}
