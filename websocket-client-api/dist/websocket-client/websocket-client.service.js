"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var WebsocketClientService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketClientService = void 0;
const common_1 = require("@nestjs/common");
const socket_io_client_1 = require("socket.io-client");
let WebsocketClientService = WebsocketClientService_1 = class WebsocketClientService {
    logger = new common_1.Logger(WebsocketClientService_1.name);
    socket = null;
    isConnected = false;
    pendingRequests = new Map();
    requestTimeout = 10000;
    WEBSOCKET_SERVER_URL = 'http://localhost:3000';
    async onModuleInit() {
        await this.connect();
    }
    async onModuleDestroy() {
        await this.disconnect();
    }
    async connect() {
        if (this.socket && this.isConnected) {
            return;
        }
        return new Promise((resolve, reject) => {
            this.logger.log('Connecting to WebSocket server...');
            this.socket = (0, socket_io_client_1.io)(this.WEBSOCKET_SERVER_URL, {
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
            this.socket.on('response', (data) => {
                this.handleResponse('response', data);
            });
            this.socket.on('error', (data) => {
                this.logger.error(`WebSocket error: ${JSON.stringify(data)}`);
                this.handleResponse('error', data);
            });
        });
    }
    async disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
            this.logger.log('Disconnected from WebSocket server');
        }
    }
    async sendMessage(message) {
        return this.sendRequest({
            type: 'message',
            data: { message },
        });
    }
    async sendPing() {
        return this.sendRequest({
            type: 'ping',
            data: { timestamp: Date.now() },
        });
    }
    async sendBroadcast(message) {
        return this.sendRequest({
            type: 'broadcast',
            data: { message },
        });
    }
    async sendRequest(request) {
        if (!this.socket || !this.isConnected) {
            await this.connect();
        }
        const requestId = request.requestId || this.generateRequestId();
        const requestWithId = { ...request, requestId };
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                this.pendingRequests.delete(requestId);
                reject(new Error(`Request timeout after ${this.requestTimeout}ms`));
            }, this.requestTimeout);
            this.pendingRequests.set(requestId, { resolve, reject, timeout });
            try {
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
                if (request.type === 'ping') {
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
                }
                else {
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
            }
            catch (error) {
                const pending = this.pendingRequests.get(requestId);
                if (pending) {
                    this.pendingRequests.delete(requestId);
                    clearTimeout(pending.timeout);
                    pending.reject(error);
                }
            }
        });
    }
    handleResponse(type, data) {
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
    generateRequestId() {
        return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    getConnectionStatus() {
        return {
            connected: this.isConnected,
            connectionId: this.socket?.id,
        };
    }
    async getServerStatus() {
        try {
            const response = await fetch(`${this.WEBSOCKET_SERVER_URL}/websocket`);
            return await response.json();
        }
        catch (error) {
            this.logger.error(`Failed to get server status: ${error.message}`);
            throw error;
        }
    }
    async getConnections() {
        try {
            const response = await fetch(`${this.WEBSOCKET_SERVER_URL}/websocket/connections`);
            return await response.json();
        }
        catch (error) {
            this.logger.error(`Failed to get connections: ${error.message}`);
            throw error;
        }
    }
};
exports.WebsocketClientService = WebsocketClientService;
exports.WebsocketClientService = WebsocketClientService = WebsocketClientService_1 = __decorate([
    (0, common_1.Injectable)()
], WebsocketClientService);
//# sourceMappingURL=websocket-client.service.js.map