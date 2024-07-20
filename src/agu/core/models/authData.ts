import { JwtToken } from '../interface/jwt-token.interface';

export interface AuthData {
    token: JwtToken;
    email: string;
    isAdmin?: boolean;
}