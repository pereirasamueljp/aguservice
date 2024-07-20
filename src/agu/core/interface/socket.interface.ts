import { Socket } from 'socket.io';
import { AuthData } from '../models/authData';

export interface AguSocket extends Socket {
    token: AuthData;
    emitAndReceiveResponse: (room: string, event: string, args?: any, timeoutSeconds?: number) => Promise<any>;
}