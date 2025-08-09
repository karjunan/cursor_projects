import { Injectable } from '@nestjs/common';
import { WebsocketGateway, ConnectionInfo, MessageRecord } from './websocket.gateway';

@Injectable()
export class WebsocketService {
  constructor(private readonly websocketGateway: WebsocketGateway) {}

  // Get all active connections
  getConnections(): ConnectionInfo[] {
    return this.websocketGateway.getConnections();
  }

  // Get connection count
  getConnectionCount(): number {
    return this.websocketGateway.getConnectionCount();
  }

  // Get message history
  getMessageHistory(): MessageRecord[] {
    return this.websocketGateway.getMessageHistory();
  }

  // Send message to specific connection
  sendToConnection(connectionId: string, event: string, data: any): boolean {
    try {
      this.websocketGateway.sendToConnection(connectionId, event, data);
      return true;
    } catch (error) {
      console.error('Failed to send message to connection:', error);
      return false;
    }
  }

  // Broadcast message to all connections
  broadcast(event: string, data: any): boolean {
    try {
      this.websocketGateway.broadcast(event, data);
      return true;
    } catch (error) {
      console.error('Failed to broadcast message:', error);
      return false;
    }
  }

  // Disconnect specific connection
  disconnectConnection(connectionId: string): boolean {
    try {
      this.websocketGateway.disconnectConnection(connectionId);
      return true;
    } catch (error) {
      console.error('Failed to disconnect connection:', error);
      return false;
    }
  }

  // Disconnect all connections
  disconnectAll(): boolean {
    try {
      this.websocketGateway.disconnectAll();
      return true;
    } catch (error) {
      console.error('Failed to disconnect all connections:', error);
      return false;
    }
  }

  // Get server status
  getServerStatus() {
    return {
      connectionCount: this.getConnectionCount(),
      connections: this.getConnections().map(conn => ({
        ...conn,
        connectedAt: conn.connectedAt.toISOString(),
        lastActivity: conn.lastActivity.toISOString(),
      })),
      messageHistory: this.getMessageHistory().map(msg => ({
        ...msg,
        timestamp: msg.timestamp.toISOString(),
      })),
    };
  }

  // Check if connection exists
  connectionExists(connectionId: string): boolean {
    const connections = this.getConnections();
    return connections.some(conn => conn.id === connectionId);
  }

  // Get connection info by ID
  getConnectionById(connectionId: string): ConnectionInfo | null {
    const connections = this.getConnections();
    return connections.find(conn => conn.id === connectionId) || null;
  }

  // Get connections by IP address
  getConnectionsByIp(ip: string): ConnectionInfo[] {
    const connections = this.getConnections();
    return connections.filter(conn => conn.ip === ip);
  }

  // Get recent messages (last N messages)
  getRecentMessages(count: number = 10): MessageRecord[] {
    const messages = this.getMessageHistory();
    return messages.slice(-count);
  }

  // Get messages by connection ID
  getMessagesByConnection(connectionId: string): MessageRecord[] {
    const messages = this.getMessageHistory();
    return messages.filter(msg => msg.connectionId === connectionId);
  }

  // Get messages by event type
  getMessagesByEvent(event: string): MessageRecord[] {
    const messages = this.getMessageHistory();
    return messages.filter(msg => msg.event === event);
  }
} 