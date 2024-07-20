import { Module } from '@nestjs/common';
import { AuthStrategyModule } from './authStrategy/authStrategy.module';
import { TokenModule } from './token/token.module';


@Module({
    imports: [ 
        TokenModule,
        AuthStrategyModule,
    ]
})
export class AuthModule { }