import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
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
export declare class WebsocketClientService implements OnModuleInit, OnModuleDestroy {
    private readonly logger;
    private socket;
    private isConnected;
    private pendingRequests;
    private requestTimeout;
    private readonly WEBSOCKET_SERVER_URL;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    sendMessage(message: string): Promise<WebSocketResponse>;
    sendPing(): Promise<WebSocketResponse>;
    sendBroadcast(message: string): Promise<WebSocketResponse>;
    private sendRequest;
    private handleResponse;
    private generateRequestId;
    getConnectionStatus(): {
        connected: boolean;
        connectionId?: string;
    };
    getServerStatus(): Promise<any>;
    getConnections(): Promise<any>;
}
