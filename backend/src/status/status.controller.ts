import * as WebSocket from 'ws'; // Verwende * as WebSocket statt default import
import { Controller, Get } from '@nestjs/common';
import { Status } from './entities/status';

@Controller('api/v3/status')
export class StatusController {
  @Get()
  async getStatus() {
    let status = await Status.findAll();
    // status = status.filter((s) => s.host.startsWith("ws://") || s.host.startsWith("wss://"));

    const status2: (Status & { up: boolean })[] = status.map((s) => s.toJSON());
    for (const s of status2) {
      s.up = false;
    }
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    await Promise.all(
      status2.map(async (s) => {
        try {
          if (s.host.startsWith('ws://') || s.host.startsWith('wss://')) {
            s.up = await this.checkWebSocketReachability(s.host, s.port);
          } else {
            const response = await fetch(`${s.host}:${s.port}`);
            s.up = true;
          }
        } catch (error: any) {
          s.up = false;
        }
      }),
    );
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';
    return status2;
  }

  async checkWebSocketReachability(
    url: string,
    port: number,
  ): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const fullUrl = `${url}:${port}`;
      const socket = new WebSocket(fullUrl);

      socket.on('open', () => {
        socket.close();
        resolve(true);
      });

      socket.on('error', (error) => {
        resolve(false);
      });

      socket.on('close', (code, reason) => {
        if (code !== 1000) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }
}
