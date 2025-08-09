import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return {
      message: 'WebSocket Client API',
      description: 'REST API that forwards requests to WebSocket server',
      version: '1.0.0',
      endpoints: {
        'POST /api/message': 'Send a message via WebSocket',
        'POST /api/broadcast': 'Send a broadcast via WebSocket',
        'POST /api/ping': 'Send a ping via WebSocket',
        'GET /api/status': 'Get connection status',
        'GET /api/connections': 'Get active connections',
        'GET /api/health': 'Health check',
        'POST /api/bulk/messages': 'Send multiple messages',
        'POST /api/bulk/pings': 'Send multiple pings',
      },
      websocketServer: 'http://localhost:3000',
    };
  }

  @Get('test')
  test() {
    return "hello"
  }
}
