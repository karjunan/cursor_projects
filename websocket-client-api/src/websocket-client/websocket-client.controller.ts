import {
  Controller,
  Post,
  Get,
  Body,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { WebsocketClientService } from './websocket-client.service';

interface SendMessageDto {
  message: string;
}

interface SendBroadcastDto {
  message: string;
}

interface PingDto {
  // Optional ping data
}

@Controller('api')
export class WebsocketClientController {
  private readonly logger = new Logger(WebsocketClientController.name);

  constructor(private readonly websocketClientService: WebsocketClientService) {}

  @Post('message')
  async sendMessage(@Body() body: SendMessageDto) {
    try {
      this.logger.log(`Received REST request to send message: ${body.message}`);
      
      const response = await this.websocketClientService.sendMessage(body.message);
      
      this.logger.log(`Message sent successfully via WebSocket`);
      
      return {
        success: true,
        message: 'Message sent successfully via WebSocket',
        data: {
          originalMessage: body.message,
          websocketResponse: response,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      this.logger.error(`Failed to send message: ${error.message}`);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to send message via WebSocket',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('broadcast')
  async sendBroadcast(@Body() body: SendBroadcastDto) {
    try {
      this.logger.log(`Received REST request to send broadcast: ${body.message}`);
      
      const response = await this.websocketClientService.sendBroadcast(body.message);
      
      this.logger.log(`Broadcast sent successfully via WebSocket`);
      
      return {
        success: true,
        message: 'Broadcast sent successfully via WebSocket',
        data: {
          originalMessage: body.message,
          websocketResponse: response,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      this.logger.error(`Failed to send broadcast: ${error.message}`);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to send broadcast via WebSocket',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('ping')
  async sendPing(@Body() body: PingDto) {
    try {
      this.logger.log('Received REST request to send ping');
      
      const response = await this.websocketClientService.sendPing();
      
      this.logger.log(`Ping sent successfully via WebSocket`);
      
      return {
        success: true,
        message: 'Ping sent successfully via WebSocket',
        data: {
          websocketResponse: response,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      this.logger.error(`Failed to send ping: ${error.message}`);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to send ping via WebSocket',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('status')
  async getStatus() {
    try {
      const connectionStatus = this.websocketClientService.getConnectionStatus();
      const serverStatus = await this.websocketClientService.getServerStatus();
      
      return {
        success: true,
        data: {
          client: {
            connected: connectionStatus.connected,
            connectionId: connectionStatus.connectionId,
          },
          server: serverStatus.data,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      this.logger.error(`Failed to get status: ${error.message}`);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to get status',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('connections')
  async getConnections() {
    try {
      const connections = await this.websocketClientService.getConnections();
      
      return {
        success: true,
        data: {
          connections: connections.data,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      this.logger.error(`Failed to get connections: ${error.message}`);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to get connections',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('health')
  async getHealth() {
    const connectionStatus = this.websocketClientService.getConnectionStatus();
    
    return {
      status: connectionStatus.connected ? 'healthy' : 'unhealthy',
      websocket: {
        connected: connectionStatus.connected,
        connectionId: connectionStatus.connectionId,
      },
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  // Bulk operations
  @Post('bulk/messages')
  async sendBulkMessages(@Body() body: { messages: string[] }) {
    try {
      this.logger.log(`Received REST request to send ${body.messages.length} messages`);
      
      const results: Array<{
        message: string;
        success: boolean;
        response?: any;
        error?: string;
      }> = [];
      
      for (const message of body.messages) {
        try {
          const response = await this.websocketClientService.sendMessage(message);
          results.push({
            message,
            success: true,
            response,
          });
        } catch (error) {
          results.push({
            message,
            success: false,
            error: error.message,
          });
        }
      }
      
      const successCount = results.filter(r => r.success).length;
      const failureCount = results.length - successCount;
      
      return {
        success: true,
        message: `Bulk messages sent: ${successCount} successful, ${failureCount} failed`,
        data: {
          total: body.messages.length,
          successful: successCount,
          failed: failureCount,
          results,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      this.logger.error(`Failed to send bulk messages: ${error.message}`);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to send bulk messages',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('bulk/pings')
  async sendBulkPings(@Body() body: { count: number }) {
    try {
      this.logger.log(`Received REST request to send ${body.count} pings`);
      
      const results: Array<{
        pingNumber: number;
        success: boolean;
        response?: any;
        error?: string;
      }> = [];
      
      for (let i = 0; i < body.count; i++) {
        try {
          const response = await this.websocketClientService.sendPing();
          results.push({
            pingNumber: i + 1,
            success: true,
            response,
          });
        } catch (error) {
          results.push({
            pingNumber: i + 1,
            success: false,
            error: error.message,
          });
        }
      }
      
      const successCount = results.filter(r => r.success).length;
      const failureCount = results.length - successCount;
      
      return {
        success: true,
        message: `Bulk pings sent: ${successCount} successful, ${failureCount} failed`,
        data: {
          total: body.count,
          successful: successCount,
          failed: failureCount,
          results,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      this.logger.error(`Failed to send bulk pings: ${error.message}`);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to send bulk pings',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 