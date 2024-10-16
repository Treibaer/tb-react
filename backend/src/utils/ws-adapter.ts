import { INestApplicationContext } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { ServerOptions } from "socket.io";

export class SocketIoAdapter extends IoAdapter {
  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    port = this.configService.get<number>("WS_PORT")!;
    const path = this.configService.get<string>("SOCKETIO.SERVER.PATH");
    const origins = this.configService.get<string>(
      "SOCKETIO.SERVER.CORS.ORIGIN",
    );
    options!.path = path!;
    const server = super.createIOServer(port, options);
    return server;
  }
}
