import { AuthStrategyModule } from '../../core/auth/authStrategy/authStrategy.module';
import { Module, forwardRef } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';

@Module({
    imports: [
        forwardRef(() => AuthStrategyModule)
    ],
    providers: [SocketGateway],
    exports: [SocketGateway]
})
export class SocketModule {
    constructor() { }
}