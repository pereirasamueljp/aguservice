import { Cache } from './../../core/libs/redis';
import { AppModule } from '../../../app.module';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, WsException, OnGatewayInit } from '@nestjs/websockets';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as redisIoAdapter from 'socket.io-redis';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { AuthService } from '../../core/auth/authStrategy/auth.service';
import { AuthData } from '../../core/models/authData';
import { AguSocket } from '../../core/interface/socket.interface';

const redisAdapter = redisIoAdapter({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT || 6379 });

function getTimestamp(){
    return Math.floor(+(new Date()) / 1000)
}

@WebSocketGateway({ transports: ['websocket'] })
export class SocketGateway implements OnGatewayInit {

    private readonly connection$: Subject<AguSocket> = new Subject<AguSocket>();

    constructor(
        private readonly _authService: AuthService
    ) { }

    @WebSocketServer()
    socket: AguSocket;

    afterInit() {
        this.socket.emitAndReceiveResponse = (room: string, event: string, args: any = null, timeoutSeconds: number = 15) => {

            const started = getTimestamp();

            return new Promise((resolve, reject) => {
                let finished = false;
                let interval;
                let contador = 0;

                const replyEvent = `fn-${uuid()}`;

                interval = setInterval(async () => {
                    contador++;
                    const response: any = await Cache.get(replyEvent);
                    if (response) {
                        finished = true;
                        clearInterval(interval);
                        if (response.erro) {
                            reject(new Error(response.erro));
                        } else {
                            resolve(response);
                        }
                    }
                    if ((getTimestamp() - started) >= timeoutSeconds) {
                        finished = true;
                        clearInterval(interval);
                        reject(new Error('Estourou o tempo limite de comunicação!'));
                    }
                }, 100);

                AppModule.socket.to(room).emit(event, { replyEvent, args });

            });

        };
        AppModule.socket = this.socket;

    }

    onConnection(): Subject<AguSocket> {
        return this.connection$;
    }

    getRoomName(authData: AuthData): string {
        return `${authData.email}:${authData.token}`;
    }

    @SubscribeMessage('authenticate')
    async authenticate(socket: AguSocket, data) {
        if (data.token) {
            const tokenId = data.token;
            try {
                const token = await this._authService.validaTokenSocket(tokenId);
                socket.token = token;
                const result: any = { event: 'authenticated', data: true };
                return result;
            } catch (e) {
                throw new WsException('Credenciais inválidas!');
            }
        }
    }

    @SubscribeMessage('connection')
    connection(socket: AguSocket) {
        this.connection$.next(socket);
        socket.on('reply', async (response) => {
            if (response && response.replyEvent) {
                await Cache.set(response.replyEvent, response.response || null);
            }
        });
        
        socket.on('interface connect', data => {
            socket.join(String(socket.token.email));
            console.log('Interface angular ws conectado');
        });

        socket.on('join room', data => {
            if (!socket.token) {
                console.log('Token non indeitifcated!');
                return;
            }
            const sala = this.getRoomName(socket.token);
            socket.join(sala);
            console.log(`Socket ${socket.id} entrando na sala ${sala}`);
        });

        socket.on('leave room', data => {
            if (!socket.token) {
                console.log('Token não identificado!');
                return;
            }
            const sala = this.getRoomName(socket.token);
            socket.leave(sala);
            console.log(`Socket ${socket.id} saindo da sala ${sala}`);
        });

        socket.on('ping-socket', (data, fn) => {
            console.log(`PONG - ${data.date}`);
            fn({
                date: moment().format()
            });
        });

        socket.on('error', data => {
            console.log(data);
        });
    }
}

export class RedisIoAdapter extends IoAdapter {
    createIOServer(port: number, options?: any): any {
        const server = super.createIOServer(port, options);
        server.adapter(redisAdapter);
        return server;
    }
}