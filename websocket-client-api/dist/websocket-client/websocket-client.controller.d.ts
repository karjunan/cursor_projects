import { WebsocketClientService } from './websocket-client.service';
interface SendMessageDto {
    message: string;
}
interface SendBroadcastDto {
    message: string;
}
interface PingDto {
}
export declare class WebsocketClientController {
    private readonly websocketClientService;
    private readonly logger;
    constructor(websocketClientService: WebsocketClientService);
    sendMessage(body: SendMessageDto): Promise<{
        success: boolean;
        message: string;
        data: {
            originalMessage: string;
            websocketResponse: import("./websocket-client.service").WebSocketResponse;
            timestamp: string;
        };
    }>;
    sendBroadcast(body: SendBroadcastDto): Promise<{
        success: boolean;
        message: string;
        data: {
            originalMessage: string;
            websocketResponse: import("./websocket-client.service").WebSocketResponse;
            timestamp: string;
        };
    }>;
    sendPing(body: PingDto): Promise<{
        success: boolean;
        message: string;
        data: {
            websocketResponse: import("./websocket-client.service").WebSocketResponse;
            timestamp: string;
        };
    }>;
    getStatus(): Promise<{
        success: boolean;
        data: {
            client: {
                connected: boolean;
                connectionId: string | undefined;
            };
            server: any;
            timestamp: string;
        };
    }>;
    getConnections(): Promise<{
        success: boolean;
        data: {
            connections: any;
            timestamp: string;
        };
    }>;
    getHealth(): Promise<{
        status: string;
        websocket: {
            connected: boolean;
            connectionId: string | undefined;
        };
        timestamp: string;
        uptime: number;
    }>;
    sendBulkMessages(body: {
        messages: string[];
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            total: number;
            successful: number;
            failed: number;
            results: {
                message: string;
                success: boolean;
                response?: any;
                error?: string;
            }[];
            timestamp: string;
        };
    }>;
    sendBulkPings(body: {
        count: number;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            total: number;
            successful: number;
            failed: number;
            results: {
                pingNumber: number;
                success: boolean;
                response?: any;
                error?: string;
            }[];
            timestamp: string;
        };
    }>;
}
export {};
