import { Injectable } from '@nestjs/common';
import { AguSocket } from 'src/agu/core/interface/socket.interface';


@Injectable()
export class SocketService {
    public socket: AguSocket = null;
}