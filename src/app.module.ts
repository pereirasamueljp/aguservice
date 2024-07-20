import { forwardRef, INestApplication, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AguSocket } from './agu/core/interface/socket.interface';
import { AguModule } from './agu/agu.module';
import { SocketModule } from './agu/modules/socket/socket.module';

@Module({
  imports: [
    AguModule,
    forwardRef(() => SocketModule),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        type: 'mysql',
        host: process.env.DBHOST,
        port: Number(process.env.DBPORT),
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        entities: [
          process.env.DEBUG ? __dirname + '/../**/*.entity{.ts,.js}' : __dirname + "**/**/**.entity{.ts,.js}",
        ],
        synchronize: process.env.DEBUG ? true : false,
      }),
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static appInstance: INestApplication;
  static basePath: string;
  static socket: AguSocket;

  constructor() {
  }


}
