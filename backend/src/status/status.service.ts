import { Injectable } from '@nestjs/common';
import * as WebSocket from 'ws';
import { Status } from './entities/status';

@Injectable()
export class StatusService {
  async fetchStatus() {
    return await Status.findAll();
  }

  async getLiveStatus() {
    const status: (Status & { up: boolean })[] = (await this.fetchStatus()).map(
      (s) => s.toJSON(),
    );
    for (const s of status) {
      s.up = false;
    }
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    await Promise.all(
      status.map(async (s) => {
        try {
          if (s.host.startsWith('ws://') || s.host.startsWith('wss://')) {
            s.up = await this.checkWebSocketReachability(s.host, s.port);
          } else {
            const response = await fetch(`${s.host}:${s.port}`);
            // console.log(s.host, s.port, response.status);
            // set false, if status is 410
            s.up = response.status < 410;
          }
        } catch (error: any) {
          s.up = false;
        }
      }),
    );
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';
    return status;
  }

  private async checkWebSocketReachability(
    url: string,
    port: number,
  ): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const fullUrl = `${url}:${port}/socket.io/?EIO=4&transport=websocket`;
      const socket = new WebSocket(fullUrl);

      socket.on('open', () => {
        socket.close();
        resolve(true);
      });

      socket.on('error', (_error) => resolve(false));

      socket.on('close', (code, _reason) => {
        if (code !== 1000) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }
}
