import { WebsocketGateway, ConnectionInfo, MessageRecord } from './websocket.gateway';
export declare class WebsocketService {
    private readonly websocketGateway;
    constructor(websocketGateway: WebsocketGateway);
    getConnections(): ConnectionInfo[];
    getConnectionCount(): number;
    getMessageHistory(): MessageRecord[];
    sendToConnection(connectionId: string, event: string, data: any): boolean;
    broadcast(event: string, data: any): boolean;
    disconnectConnection(connectionId: string): boolean;
    disconnectAll(): boolean;
    getServerStatus(): {
        connectionCount: number;
        connections: {
            connectedAt: string;
            lastActivity: string;
            id: string;
            userAgent?: string;
            ip?: string;
        }[];
        messageHistory: {
            timestamp: string;
            id: string;
            event: string;
            data: any;
            connectionId: string;
        }[];
    };
    connectionExists(connectionId: string): boolean;
    getConnectionById(connectionId: string): ConnectionInfo | null;
    getConnectionsByIp(ip: string): ConnectionInfo[];
    getRecentMessages(count?: number): MessageRecord[];
    getMessagesByConnection(connectionId: string): MessageRecord[];
    getMessagesByEvent(event: string): MessageRecord[];
}
