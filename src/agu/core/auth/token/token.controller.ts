import { Controller, Post, Body} from '@nestjs/common';
import { AuthService } from '../authStrategy/auth.service';
import { UsersService } from '../users/users.service';
import { LoginData } from './models/loginData.models';
import { LoginTokenResult } from './models/loginTokenResult.model';

@Controller('auth/token')
export class TokenController {
    constructor(protected usuarioCrudService: UsersService, protected authService: AuthService) { }
    @Post('login')
    public async login(@Body() loginData: LoginData): Promise<LoginTokenResult> {
        return this.authService.signIn(loginData.email, loginData.credentials);
    }
}
