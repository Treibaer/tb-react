import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

export class SocketIoAdapter extends IoAdapter {
  constructor(private configService: ConfigService) {
    super();
  }

  createIOServer(port: number, options?: ServerOptions) {
    port = this.configService.get<number>('WS_PORT')!;
    const path = this.configService.get<string>('SOCKETIO.SERVER.PATH');
    options!.path = path!;
    const server = super.createIOServer(port, options);
    return server;
  }
}
