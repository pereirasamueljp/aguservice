import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Session } from '../middleware/session.middleware';
import { AuthData } from '../models/authData';



@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const authInfo: AuthData = Session.get<AuthData>('authInfo');
        if (!authInfo || !authInfo.isAdmin) { throw new ForbiddenException('Você não possui autorização para acessar esta url!'); }
        return true;
    }
}