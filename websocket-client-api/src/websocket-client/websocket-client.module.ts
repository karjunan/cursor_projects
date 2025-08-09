import { Module } from '@nestjs/common';
import { WebsocketClientService } from './websocket-client.service';
import { WebsocketClientController } from './websocket-client.controller';

@Module({
  providers: [WebsocketClientService],
  controllers: [WebsocketClientController],
  exports: [WebsocketClientService],
})
export class WebsocketClientModule {} 