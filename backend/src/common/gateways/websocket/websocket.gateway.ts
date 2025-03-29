import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export enum SocketEvents {
  CONNECTION = 'connection',
  DISCONNECT = 'disconnect',
  ERROR = 'error',
  MESSAGE = 'message',
  JOIN_ROOM = 'join-room',
  LEAVE_ROOM = 'leave-room',
  ONLINE_USERS = 'online-users',
}

interface SocketAuthPayload {
  userId: string;
  username: string;
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:4000'], // Configure in production
    methods: ['GET', 'POST'],
  },
  namespace: 'common',
})
export class CommonWebSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(CommonWebSocketGateway.name);
  @WebSocketServer()
  server: Server;
  private onlineUsers = new Map<string, string>();

  constructor(private readonly jwtService: JwtService) {}
  afterInit(server: Server) {
    this.logger.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        this.logger.warn('Client connection rejected: No token provided');
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify<SocketAuthPayload>(token);
      this.onlineUsers.set(client.id, payload.userId);
      this.logger.log(
        `Client connected: ${payload.username} (ID: ${payload.userId})`,
      );
      this.server.emit(
        SocketEvents.ONLINE_USERS,
        Array.from(this.onlineUsers.values()),
      );
    } catch (error) {
      this.logger.error('Client connection error', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = this.onlineUsers.get(client.id);
    if (userId) {
      this.onlineUsers.delete(client.id);
      this.logger.log(`Client disconnected: User ID ${userId}`);
      this.server.emit(
        SocketEvents.ONLINE_USERS,
        Array.from(this.onlineUsers.values()),
      );
    }
  }

  @SubscribeMessage(SocketEvents.MESSAGE)
  handleMessage(@MessageBody() data: { room: string; message: string }) {
    this.logger.log(`Message received for room ${data.room}: ${data.message}`);
    console.log('message', data);
    this.server.to(data.room).emit(SocketEvents.MESSAGE, data);
  }

  @SubscribeMessage(SocketEvents.JOIN_ROOM)
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    this.logger.log(`Client ${client.id} joined room: ${room}`);
    this.server
      .to(room)
      .emit(SocketEvents.JOIN_ROOM, { clientId: client.id, room });
  }

  @SubscribeMessage(SocketEvents.LEAVE_ROOM)
  handleLeaveRoom(client: Socket, room: string) {
    client.leave(room);
    this.logger.log(`Client ${client.id} left room: ${room}`);
    this.server
      .to(room)
      .emit(SocketEvents.LEAVE_ROOM, { clientId: client.id, room });
  }
}
