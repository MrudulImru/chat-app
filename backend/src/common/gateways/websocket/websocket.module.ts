import { Module } from '@nestjs/common';
import { CommonWebSocketGateway } from './websocket.gateway';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [CommonWebSocketGateway, JwtService],
  exports: [CommonWebSocketGateway],
})
export class WebsocketModule {}
