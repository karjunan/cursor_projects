import { WebsocketService } from './websocket.service';
interface SendMessageDto {
    action: 'broadcast' | 'sendToConnection' | 'disconnectConnection' | 'disconnectAll';
    connectionId?: string;
    event?: string;
    data?: any;
}
interface MessageQueryDto {
    connectionId?: string;
    event?: string;
    count?: number;
}
export declare class WebsocketController {
    private readonly websocketService;
    constructor(websocketService: WebsocketService);
    getServerStatus(): {
        status: string;
        data: {
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
    };
    getConnections(): {
        status: string;
        data: {
            connections: {
                connectedAt: string;
                lastActivity: string;
                id: string;
                userAgent?: string;
                ip?: string;
            }[];
            count: number;
        };
    };
    getConnection(connectionId: string): {
        status: string;
        data: {
            connectedAt: string;
            lastActivity: string;
            id: string;
            userAgent?: string;
            ip?: string;
        };
    };
    getMessages(query: MessageQueryDto): {
        status: string;
        data: {
            messages: any;
            count: any;
        };
    };
    sendCommand(command: SendMessageDto): {
        status: string;
        message: string;
        data: {
            event: string | undefined;
            data: any;
            connectionId?: undefined;
        };
    } | {
        status: string;
        message: string;
        data: {
            connectionId: string;
            event: string | undefined;
            data: any;
        };
    } | {
        status: string;
        message: string;
        data?: undefined;
    };
    broadcast(body: {
        event?: string;
        data: any;
    }): {
        status: string;
        message: string;
        data: {
            event: string | undefined;
            data: any;
        };
    };
    sendToConnection(connectionId: string, body: {
        event?: string;
        data: any;
    }): {
        status: string;
        message: string;
        data: {
            connectionId: string;
            event: string | undefined;
            data: any;
        };
    };
    disconnectConnection(connectionId: string): {
        status: string;
        message: string;
    };
    disconnectAll(): {
        status: string;
        message: string;
    };
}
export {};
