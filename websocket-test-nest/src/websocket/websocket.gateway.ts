import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

export interface ConnectionInfo {
  id: string;
  connectedAt: Date;
  userAgent?: string;
  ip?: string;
  lastActivity: Date;
}

export interface MessageRecord {
  id: string;
  timestamp: Date;
  event: string;
  data: any;
  connectionId: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
})
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WebsocketGateway.name);
  private connections: Map<string, ConnectionInfo> = new Map();
  private messageHistory: MessageRecord[] = [];

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    const connectionInfo: ConnectionInfo = {
      id: client.id,
      connectedAt: new Date(),
      userAgent: client.handshake.headers['user-agent'],
      ip: client.handshake.address,
      lastActivity: new Date(),
    };

    this.connections.set(client.id, connectionInfo);
    
    this.logger.log(`Client connected: ${client.id}`);
    this.logger.log(`Total connections: ${this.connections.size}`);

    // Send welcome message
    client.emit('welcome', {
      message: 'Connected to WebSocket server',
      connectionId: client.id,
      totalConnections: this.connections.size,
      timestamp: new Date(),
    });

    // Broadcast new connection to all clients
    client.broadcast.emit('userJoined', {
      connectionId: client.id,
      totalConnections: this.connections.size,
      timestamp: new Date(),
    });
  }

  handleDisconnect(client: Socket) {
    this.connections.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
    this.logger.log(`Total connections: ${this.connections.size}`);
    
    // Broadcast disconnection to all clients
    client.broadcast.emit('userLeft', {
      connectionId: client.id,
      totalConnections: this.connections.size,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, data: any) {
    this.handleClientMessage(client, 'message', data);
  }

  @SubscribeMessage('ping')
  handlePing(client: Socket, data: any) {
    this.handleClientMessage(client, 'ping', data);
    client.emit('pong', {
      timestamp: new Date(),
      connectionId: client.id,
    });
  }

  @SubscribeMessage('broadcast')
  handleBroadcast(client: Socket, data: any) {
    this.handleClientMessage(client, 'broadcast', data);
    // Broadcast to all clients except sender
    client.broadcast.emit('broadcast', {
      from: client.id,
      message: data.message,
      timestamp: new Date(),
    });
  }

  private handleClientMessage(client: Socket, event: string, data: any) {
    const connectionInfo = this.connections.get(client.id);
    if (connectionInfo) {
      connectionInfo.lastActivity = new Date();
    }

    const messageRecord: MessageRecord = {
      id: `${client.id}-${Date.now()}`,
      timestamp: new Date(),
      event,
      data,
      connectionId: client.id,
    };

    this.messageHistory.push(messageRecord);
    
    // Keep only last 100 messages
    if (this.messageHistory.length > 100) {
      this.messageHistory = this.messageHistory.slice(-100);
    }

    this.logger.log(`Message from ${client.id}:`, { event, data });
  }

  // Public methods for external access
  getConnections(): ConnectionInfo[] {
    return Array.from(this.connections.values());
  }

  getConnectionCount(): number {
    return this.connections.size;
  }

  getMessageHistory(): MessageRecord[] {
    return this.messageHistory;
  }

  sendToConnection(connectionId: string, event: string, data: any) {
    this.server.to(connectionId).emit(event, data);
  }

  broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }

  disconnectConnection(connectionId: string) {
    const socket = this.server.sockets.sockets.get(connectionId);
    if (socket) {
      socket.disconnect();
    }
  }

  disconnectAll() {
    this.server.disconnectSockets();
  }
} 