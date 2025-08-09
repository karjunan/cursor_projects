import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { WebsocketService } from './websocket.service';

interface SendMessageDto {
  action: 'broadcast' | 'sendToConnection' | 'disconnectConnection' | 'disconnectAll';
  connectionId?: string;
  event?: string;
  data?: any;
}

interface ConnectionQueryDto {
  ip?: string;
  connectionId?: string;
}

interface MessageQueryDto {
  connectionId?: string;
  event?: string;
  count?: number;
}

@Controller('websocket')
export class WebsocketController {
  constructor(private readonly websocketService: WebsocketService) {}

  // GET /websocket - Get WebSocket server status
  @Get()
  getServerStatus() {
    try {
      return {
        status: 'success',
        data: this.websocketService.getServerStatus(),
      };
    } catch (error) {
      throw new HttpException(
        'Failed to get WebSocket status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // GET /websocket/connections - Get all connections
  @Get('connections')
  getConnections() {
    try {
      return {
        status: 'success',
        data: {
          connections: this.websocketService.getConnections().map(conn => ({
            ...conn,
            connectedAt: conn.connectedAt.toISOString(),
            lastActivity: conn.lastActivity.toISOString(),
          })),
          count: this.websocketService.getConnectionCount(),
        },
      };
    } catch (error) {
      throw new HttpException(
        'Failed to get connections',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // GET /websocket/connections/:connectionId - Get specific connection
  @Get('connections/:connectionId')
  getConnection(@Param('connectionId') connectionId: string) {
    try {
      const connection = this.websocketService.getConnectionById(connectionId);
      if (!connection) {
        throw new HttpException(
          'Connection not found',
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        status: 'success',
        data: {
          ...connection,
          connectedAt: connection.connectedAt.toISOString(),
          lastActivity: connection.lastActivity.toISOString(),
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to get connection',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // GET /websocket/messages - Get message history
  @Get('messages')
  getMessages(@Body() query: MessageQueryDto) {
    try {
      let messages;
      
      if (query.connectionId) {
        messages = this.websocketService.getMessagesByConnection(query.connectionId);
      } else if (query.event) {
        messages = this.websocketService.getMessagesByEvent(query.event);
      } else {
        messages = this.websocketService.getRecentMessages(query.count || 10);
      }

      return {
        status: 'success',
        data: {
          messages: messages.map(msg => ({
            ...msg,
            timestamp: msg.timestamp.toISOString(),
          })),
          count: messages.length,
        },
      };
    } catch (error) {
      throw new HttpException(
        'Failed to get messages',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // POST /websocket - Send commands to WebSocket server
  @Post()
  sendCommand(@Body() command: SendMessageDto) {
    try {
      switch (command.action) {
        case 'broadcast':
          const broadcastSuccess = this.websocketService.broadcast(
            command.event || 'message',
            command.data,
          );
          if (!broadcastSuccess) {
            throw new HttpException(
              'Failed to broadcast message',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
          return {
            status: 'success',
            message: 'Message broadcasted to all connections',
            data: { event: command.event, data: command.data },
          };

        case 'sendToConnection':
          if (!command.connectionId) {
            throw new HttpException(
              'connectionId is required for sendToConnection action',
              HttpStatus.BAD_REQUEST,
            );
          }
          
          if (!this.websocketService.connectionExists(command.connectionId)) {
            throw new HttpException(
              'Connection not found',
              HttpStatus.NOT_FOUND,
            );
          }

          const sendSuccess = this.websocketService.sendToConnection(
            command.connectionId,
            command.event || 'message',
            command.data,
          );
          
          if (!sendSuccess) {
            throw new HttpException(
              'Failed to send message to connection',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }

          return {
            status: 'success',
            message: `Message sent to connection ${command.connectionId}`,
            data: { connectionId: command.connectionId, event: command.event, data: command.data },
          };

        case 'disconnectConnection':
          if (!command.connectionId) {
            throw new HttpException(
              'connectionId is required for disconnectConnection action',
              HttpStatus.BAD_REQUEST,
            );
          }

          if (!this.websocketService.connectionExists(command.connectionId)) {
            throw new HttpException(
              'Connection not found',
              HttpStatus.NOT_FOUND,
            );
          }

          const disconnectSuccess = this.websocketService.disconnectConnection(
            command.connectionId,
          );
          
          if (!disconnectSuccess) {
            throw new HttpException(
              'Failed to disconnect connection',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }

          return {
            status: 'success',
            message: `Connection ${command.connectionId} disconnected`,
          };

        case 'disconnectAll':
          const disconnectAllSuccess = this.websocketService.disconnectAll();
          
          if (!disconnectAllSuccess) {
            throw new HttpException(
              'Failed to disconnect all connections',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }

          return {
            status: 'success',
            message: 'All connections disconnected',
          };

        default:
          throw new HttpException(
            'Invalid action. Use: broadcast, sendToConnection, disconnectConnection, or disconnectAll',
            HttpStatus.BAD_REQUEST,
          );
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to process WebSocket command',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // POST /websocket/broadcast - Broadcast message
  @Post('broadcast')
  broadcast(@Body() body: { event?: string; data: any }) {
    try {
      const success = this.websocketService.broadcast(
        body.event || 'message',
        body.data,
      );
      
      if (!success) {
        throw new HttpException(
          'Failed to broadcast message',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return {
        status: 'success',
        message: 'Message broadcasted to all connections',
        data: { event: body.event, data: body.data },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to broadcast message',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // POST /websocket/connections/:connectionId/send - Send message to specific connection
  @Post('connections/:connectionId/send')
  sendToConnection(
    @Param('connectionId') connectionId: string,
    @Body() body: { event?: string; data: any },
  ) {
    try {
      if (!this.websocketService.connectionExists(connectionId)) {
        throw new HttpException(
          'Connection not found',
          HttpStatus.NOT_FOUND,
        );
      }

      const success = this.websocketService.sendToConnection(
        connectionId,
        body.event || 'message',
        body.data,
      );
      
      if (!success) {
        throw new HttpException(
          'Failed to send message to connection',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return {
        status: 'success',
        message: `Message sent to connection ${connectionId}`,
        data: { connectionId, event: body.event, data: body.data },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to send message to connection',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // DELETE /websocket/connections/:connectionId - Disconnect specific connection
  @Post('connections/:connectionId/disconnect')
  disconnectConnection(@Param('connectionId') connectionId: string) {
    try {
      if (!this.websocketService.connectionExists(connectionId)) {
        throw new HttpException(
          'Connection not found',
          HttpStatus.NOT_FOUND,
        );
      }

      const success = this.websocketService.disconnectConnection(connectionId);
      
      if (!success) {
        throw new HttpException(
          'Failed to disconnect connection',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return {
        status: 'success',
        message: `Connection ${connectionId} disconnected`,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to disconnect connection',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // POST /websocket/disconnect-all - Disconnect all connections
  @Post('disconnect-all')
  disconnectAll() {
    try {
      const success = this.websocketService.disconnectAll();
      
      if (!success) {
        throw new HttpException(
          'Failed to disconnect all connections',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return {
        status: 'success',
        message: 'All connections disconnected',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to disconnect all connections',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 