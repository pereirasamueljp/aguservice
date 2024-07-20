import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/authStrategy/auth.service';
import { TokenModule } from './auth/token/token.module';
import { UsersModule } from './auth/users/users.module';
import { UsersService } from './auth/users/users.service';




@Module({
    imports: [
        UsersModule,
        TokenModule,
        AuthModule,
    ],
    providers: [AuthService,UsersService],
    exports: [],
})
export class CoreModule { }