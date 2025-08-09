"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WebsocketGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
let WebsocketGateway = WebsocketGateway_1 = class WebsocketGateway {
    server;
    logger = new common_1.Logger(WebsocketGateway_1.name);
    connections = new Map();
    messageHistory = [];
    afterInit(server) {
        this.logger.log('WebSocket Gateway initialized');
    }
    handleConnection(client) {
        const connectionInfo = {
            id: client.id,
            connectedAt: new Date(),
            userAgent: client.handshake.headers['user-agent'],
            ip: client.handshake.address,
            lastActivity: new Date(),
        };
        this.connections.set(client.id, connectionInfo);
        this.logger.log(`Client connected: ${client.id}`);
        this.logger.log(`Total connections: ${this.connections.size}`);
        client.emit('welcome', {
            message: 'Connected to WebSocket server',
            connectionId: client.id,
            totalConnections: this.connections.size,
            timestamp: new Date(),
        });
        client.broadcast.emit('userJoined', {
            connectionId: client.id,
            totalConnections: this.connections.size,
            timestamp: new Date(),
        });
    }
    handleDisconnect(client) {
        this.connections.delete(client.id);
        this.logger.log(`Client disconnected: ${client.id}`);
        this.logger.log(`Total connections: ${this.connections.size}`);
        client.broadcast.emit('userLeft', {
            connectionId: client.id,
            totalConnections: this.connections.size,
            timestamp: new Date(),
        });
    }
    handleMessage(client, data) {
        this.handleClientMessage(client, 'message', data);
    }
    handlePing(client, data) {
        this.handleClientMessage(client, 'ping', data);
        client.emit('pong', {
            timestamp: new Date(),
            connectionId: client.id,
        });
    }
    handleBroadcast(client, data) {
        this.handleClientMessage(client, 'broadcast', data);
        client.broadcast.emit('broadcast', {
            from: client.id,
            message: data.message,
            timestamp: new Date(),
        });
    }
    handleClientMessage(client, event, data) {
        const connectionInfo = this.connections.get(client.id);
        if (connectionInfo) {
            connectionInfo.lastActivity = new Date();
        }
        const messageRecord = {
            id: `${client.id}-${Date.now()}`,
            timestamp: new Date(),
            event,
            data,
            connectionId: client.id,
        };
        this.messageHistory.push(messageRecord);
        if (this.messageHistory.length > 100) {
            this.messageHistory = this.messageHistory.slice(-100);
        }
        this.logger.log(`Message from ${client.id}:`, { event, data });
    }
    getConnections() {
        return Array.from(this.connections.values());
    }
    getConnectionCount() {
        return this.connections.size;
    }
    getMessageHistory() {
        return this.messageHistory;
    }
    sendToConnection(connectionId, event, data) {
        this.server.to(connectionId).emit(event, data);
    }
    broadcast(event, data) {
        this.server.emit(event, data);
    }
    disconnectConnection(connectionId) {
        const socket = this.server.sockets.sockets.get(connectionId);
        if (socket) {
            socket.disconnect();
        }
    }
    disconnectAll() {
        this.server.disconnectSockets();
    }
};
exports.WebsocketGateway = WebsocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WebsocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('ping'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handlePing", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('broadcast'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleBroadcast", null);
exports.WebsocketGateway = WebsocketGateway = WebsocketGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
        transports: ['websocket', 'polling'],
    })
], WebsocketGateway);
//# sourceMappingURL=websocket.gateway.js.map