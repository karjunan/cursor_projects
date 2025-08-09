import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';

export interface WebSocketRequest {
  type: 'message' | 'ping' | 'broadcast';
  data: any;
  requestId?: string;
}

export interface WebSocketResponse {
  success: boolean;
  data?: any;
  error?: string;
  requestId?: string;
  timestamp: Date;
}

@Injectable()
export class WebsocketClientService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(WebsocketClientService.name);
  private socket: Socket | null = null;
  private isConnected = false;
  private pendingRequests = new Map<string, { resolve: Function; reject: Function; timeout: NodeJS.Timeout }>();
  private requestTimeout = 10000; // 10 seconds

  private readonly WEBSOCKET_SERVER_URL = 'http://localhost:3000';

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  async connect(): Promise<void> {
    if (this.socket && this.isConnected) {
      return;
    }

    return new Promise((resolve, reject) => {
      this.logger.log('Connecting to WebSocket server...');

      this.socket = io(this.WEBSOCKET_SERVER_URL, {
        transports: ['websocket', 'polling'],
        timeout: 5000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.socket.on('connect', () => {
        this.isConnected = true;
        this.logger.log(`Connected to WebSocket server. Connection ID: ${this.socket?.id}`);
        resolve();
      });

      this.socket.on('disconnect', (reason) => {
        this.isConnected = false;
        this.logger.warn(`Disconnected from WebSocket server: ${reason}`);
      });

      this.socket.on('connect_error', (error) => {
        this.isConnected = false;
        this.logger.error(`Connection error: ${error.message}`);
        reject(error);
      });

      this.socket.on('welcome', (data) => {
        this.logger.log(`Welcome message: ${data.message}`);
      });

      this.socket.on('pong', (data) => {
        this.logger.log(`Pong received at ${new Date(data.timestamp).toLocaleTimeString()}`);
        this.handleResponse('ping', data);
      });

      this.socket.on('broadcast', (data) => {
        this.logger.log(`Broadcast received from ${data.from}: ${data.message}`);
        this.handleResponse('broadcast', data);
      });

      this.socket.on('message', (data) => {
        this.logger.log(`Message received: ${JSON.stringify(data)}`);
        this.handleResponse('message', data);
      });

      // Handle custom response events
      this.socket.on('response', (data) => {
        this.handleResponse('response', data);
      });

      this.socket.on('error', (data) => {
        this.logger.error(`WebSocket error: ${JSON.stringify(data)}`);
        this.handleResponse('error', data);
      });
    });
  }

  async disconnect(): Promise<void> {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.logger.log('Disconnected from WebSocket server');
    }
  }

  async sendMessage(message: string): Promise<WebSocketResponse> {
    return this.sendRequest({
      type: 'message',
      data: { message },
    });
  }

  async sendPing(): Promise<WebSocketResponse> {
    return this.sendRequest({
      type: 'ping',
      data: { timestamp: Date.now() },
    });
  }

  async sendBroadcast(message: string): Promise<WebSocketResponse> {
    return this.sendRequest({
      type: 'broadcast',
      data: { message },
    });
  }

  private async sendRequest(request: WebSocketRequest): Promise<WebSocketResponse> {
    if (!this.socket || !this.isConnected) {
      await this.connect();
    }

    const requestId = request.requestId || this.generateRequestId();
    const requestWithId = { ...request, requestId };

    return new Promise((resolve, reject) => {
      // Set timeout for the request
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        reject(new Error(`Request timeout after ${this.requestTimeout}ms`));
      }, this.requestTimeout);

      // Store the promise resolvers
      this.pendingRequests.set(requestId, { resolve, reject, timeout });

      try {
        // Send the request based on type
        switch (request.type) {
          case 'message':
            this.socket?.emit('message', requestWithId.data);
            break;
          case 'ping':
            this.socket?.emit('ping', requestWithId.data);
            break;
          case 'broadcast':
            this.socket?.emit('broadcast', requestWithId.data);
            break;
          default:
            throw new Error(`Unknown request type: ${request.type}`);
        }

        // For immediate responses, resolve with success
        if (request.type === 'ping') {
          // Ping gets immediate pong response
          setTimeout(() => {
            const pending = this.pendingRequests.get(requestId);
            if (pending) {
              this.pendingRequests.delete(requestId);
              clearTimeout(pending.timeout);
              pending.resolve({
                success: true,
                data: { message: 'Ping sent successfully' },
                requestId,
                timestamp: new Date(),
              });
            }
          }, 100);
        } else {
          // For other requests, wait for response or timeout
          setTimeout(() => {
            const pending = this.pendingRequests.get(requestId);
            if (pending) {
              this.pendingRequests.delete(requestId);
              clearTimeout(pending.timeout);
              pending.resolve({
                success: true,
                data: { message: `${request.type} sent successfully` },
                requestId,
                timestamp: new Date(),
              });
            }
          }, 500);
        }
      } catch (error) {
        const pending = this.pendingRequests.get(requestId);
        if (pending) {
          this.pendingRequests.delete(requestId);
          clearTimeout(pending.timeout);
          pending.reject(error);
        }
      }
    });
  }

  private handleResponse(type: string, data: any): void {
    // Handle different types of responses
    switch (type) {
      case 'pong':
        this.logger.log(`Pong response: ${JSON.stringify(data)}`);
        break;
      case 'broadcast':
        this.logger.log(`Broadcast response: ${JSON.stringify(data)}`);
        break;
      case 'message':
        this.logger.log(`Message response: ${JSON.stringify(data)}`);
        break;
      case 'error':
        this.logger.error(`Error response: ${JSON.stringify(data)}`);
        break;
      default:
        this.logger.log(`Unknown response type: ${type}, data: ${JSON.stringify(data)}`);
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getConnectionStatus(): { connected: boolean; connectionId?: string } {
    return {
      connected: this.isConnected,
      connectionId: this.socket?.id,
    };
  }

  async getServerStatus(): Promise<any> {
    try {
      const response = await fetch(`${this.WEBSOCKET_SERVER_URL}/websocket`);
      return await response.json();
    } catch (error) {
      this.logger.error(`Failed to get server status: ${error.message}`);
      throw error;
    }
  }

  async getConnections(): Promise<any> {
    try {
      const response = await fetch(`${this.WEBSOCKET_SERVER_URL}/websocket/connections`);
      return await response.json();
    } catch (error) {
      this.logger.error(`Failed to get connections: ${error.message}`);
      throw error;
    }
  }
} 