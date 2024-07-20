import { AuthData } from "./authData";

export interface Request{
    authInfo: AuthData;
    token: AuthData;
    rawBody: string;
}
