import { Request as RequestBase } from 'express';
import { AuthData } from '../models/authData';

export interface Request extends RequestBase{
    authInfo: AuthData;
    token: AuthData;
    rawBody: string;
}
