import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AuthStrategyModule } from '../authStrategy/authStrategy.module';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { TokenController } from './token.controller';


@Module({
    imports: [
        AuthStrategyModule,
        UsersModule
    ],
    providers: [UsersService],
    controllers: [TokenController]
})
export class TokenModule {
    public configure(consumer: MiddlewareConsumer) {
    }
}
