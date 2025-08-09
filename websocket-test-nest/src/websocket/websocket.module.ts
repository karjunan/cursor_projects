import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { WebsocketService } from './websocket.service';
import { WebsocketController } from './websocket.controller';

@Module({
  providers: [WebsocketGateway, WebsocketService],
  controllers: [WebsocketController],
  exports: [WebsocketService],
})
export class WebsocketModule {} 