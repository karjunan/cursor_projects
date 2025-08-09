import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
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
export declare class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private readonly logger;
    private connections;
    private messageHistory;
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleMessage(client: Socket, data: any): void;
    handlePing(client: Socket, data: any): void;
    handleBroadcast(client: Socket, data: any): void;
    private handleClientMessage;
    getConnections(): ConnectionInfo[];
    getConnectionCount(): number;
    getMessageHistory(): MessageRecord[];
    sendToConnection(connectionId: string, event: string, data: any): void;
    broadcast(event: string, data: any): void;
    disconnectConnection(connectionId: string): void;
    disconnectAll(): void;
}
