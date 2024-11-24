import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AccessToken } from 'src/auth/entities/access-token';
import { User } from 'src/users/entities/user.entity';
import { Connection } from './models/connection';

@WebSocketGateway(3000, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: false,
  },
  transports: ['websocket'],
  path: '/socket.io',
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private clients = new Map<string, Socket>();
  private connections = new Map<string, Connection>();

  private logger: Logger = new Logger('EventsGateway');

  constructor() {
    console.log('EventsGateway constructor');
  }

  afterInit(_server: Server) {
    const port = Number(process.env.WS_PORT ?? '3000');
    console.log('WebSocket server initialized on port ' + port);
  }

  async handleConnection(client: Socket) {
    const clientId = client.id;
    const queryParams = client.handshake.query;
    this.log(`Client connected: ${client.id}`);
    console.log(`Client connected: ${client.id}`);

    const token = Array.isArray(queryParams.token)
      ? queryParams.token.shift()
      : queryParams.token;

    if (!token || !(await this.isAuthorized(token))) {
      this.log('Authentication failed');
      client.emit('legacy', {
        type: 'error',
        id: clientId,
        message: 'Authentication failed',
      });
      client.disconnect(true);
    }
    this.clients.set(clientId, client);
    this.connections.set(clientId, new Connection(clientId));

    client.emit('legacy', { type: 'requestAuthentication', id: clientId });
    this.log('Sent requestAuthentication event to client');
  }

  private log(message: string) {
    console.log(message);
    this.logger.log(message);
  }

  private async isAuthorized(token: string) {
    const accessToken = await AccessToken.findOne({
      where: { value: token },
      include: [User],
    });
    return accessToken !== null;
  }

  handleDisconnect(client: Socket) {
    this.log(`Client disconnected: ${client.id}`);
    console.log(`Client disconnected: ${client.id}`);
    this.clients.delete(client.id);
    this.connections.delete(client.id);
  }

  @SubscribeMessage('realtime')
  async handleMessageMessagesrealtime(
    client: Socket,
    wrapper: any & { data: { type: string }; requestId?: string },
  ) {
    const type = wrapper.type;
    const connection = this.connections.get(client.id);
    if (!connection) {
      // ignore not authenticated connections
      console.error('Connection not found for client: ', client.id);
      // return;
    }
    if (!type) {
      console.error('No type in message:', wrapper);
      return;
    }
    // if (!connection.hasAuthenticated) {
    // console.error('Not authenticated:', connection);
    // client.disconnect(true);
    // return;
    // }
    console.log('realtime message received', wrapper);

    const structure = null;
    client.emit('realtime', {
      type: type,
      data: structure,
      requestId: wrapper.requestId,
    });
  }

  @SubscribeMessage('matches')
  async handleMessageMessages(
    client: Socket,
    wrapper: any & { data: { type: string } },
  ) {
    const type = wrapper.type;
    const connection = this.connections.get(client.id);
    if (!connection) {
      // ignore not authenticated connections
      console.error('Connection not found for client: ', client.id);
      return;
    }
    if (!type) {
      console.error('No type in message:', wrapper);
      return;
    }

    if (type === 'authentication') {
      this.log('Authentication received');

      connection.hasAuthenticated = true;
      connection.event = 'matches';
      client.emit('matches', {
        type: 'authentication',
        data: { state: 'success' },
      });
      return;
    }
    if (!connection.hasAuthenticated) {
      console.error('Not authenticated:', connection);
      client.disconnect(true);
      return;
    }

    // const allowedTypes = ["update", "update2"];

    // if (!allowedTypes.includes(type)) {
    //   console.error("Invalid type:", type);
    //   return;
    // }

    this.sendOthers(client.id, 0, 'matches', {
      type: type,
      data: { what: 'matches' },
    });
  }

  @SubscribeMessage('legacy')
  async handleMessageLegacy(
    client: Socket,
    wrapper: any & { data: { type: string } },
  ) {
    const type = wrapper.data.type;
    this.log('Legacy message received from client: ' + type);
    const connection = this.connections.get(client.id);
    if (!connection) {
      // ignore not authenticated connections
      console.error('Connection not found for client: ', client.id);
      return;
    }
    if (!type) {
      console.error('No type in message:', wrapper);
      return;
    }
    if (type === 'authentication') {
      this.log('Authentication received');

      connection.userId = 1;
      connection.hasAuthenticated = true;
      connection.event = 'legacy';
      return;
    }
    if (!connection.hasAuthenticated) {
      console.error('Not authenticated:', connection);
      client.disconnect(true);
      return;
    }

    const allowedTypes = ['gameState', 'settings', 'fieldCard'];

    if (!allowedTypes.includes(type)) {
      console.error('Invalid type:', type);
      return;
    }
  }

  private sendOthers(
    clientId: string,
    userId: number,
    event: string,
    data: any,
  ) {
    for (const [id, client] of this.clients) {
      const connection = this.connections.get(id);

      if (
        id === clientId ||
        !connection ||
        !connection.hasAuthenticated ||
        connection.userId !== userId ||
        connection.event !== event
      ) {
        continue;
      }
      client.emit(event, data);
    }
  }
}
