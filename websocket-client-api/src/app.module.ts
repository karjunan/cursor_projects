import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebsocketClientModule } from './websocket-client/websocket-client.module';

@Module({
  imports: [WebsocketClientModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
