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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketService = void 0;
const common_1 = require("@nestjs/common");
const websocket_gateway_1 = require("./websocket.gateway");
let WebsocketService = class WebsocketService {
    websocketGateway;
    constructor(websocketGateway) {
        this.websocketGateway = websocketGateway;
    }
    getConnections() {
        return this.websocketGateway.getConnections();
    }
    getConnectionCount() {
        return this.websocketGateway.getConnectionCount();
    }
    getMessageHistory() {
        return this.websocketGateway.getMessageHistory();
    }
    sendToConnection(connectionId, event, data) {
        try {
            this.websocketGateway.sendToConnection(connectionId, event, data);
            return true;
        }
        catch (error) {
            console.error('Failed to send message to connection:', error);
            return false;
        }
    }
    broadcast(event, data) {
        try {
            this.websocketGateway.broadcast(event, data);
            return true;
        }
        catch (error) {
            console.error('Failed to broadcast message:', error);
            return false;
        }
    }
    disconnectConnection(connectionId) {
        try {
            this.websocketGateway.disconnectConnection(connectionId);
            return true;
        }
        catch (error) {
            console.error('Failed to disconnect connection:', error);
            return false;
        }
    }
    disconnectAll() {
        try {
            this.websocketGateway.disconnectAll();
            return true;
        }
        catch (error) {
            console.error('Failed to disconnect all connections:', error);
            return false;
        }
    }
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
    connectionExists(connectionId) {
        const connections = this.getConnections();
        return connections.some(conn => conn.id === connectionId);
    }
    getConnectionById(connectionId) {
        const connections = this.getConnections();
        return connections.find(conn => conn.id === connectionId) || null;
    }
    getConnectionsByIp(ip) {
        const connections = this.getConnections();
        return connections.filter(conn => conn.ip === ip);
    }
    getRecentMessages(count = 10) {
        const messages = this.getMessageHistory();
        return messages.slice(-count);
    }
    getMessagesByConnection(connectionId) {
        const messages = this.getMessageHistory();
        return messages.filter(msg => msg.connectionId === connectionId);
    }
    getMessagesByEvent(event) {
        const messages = this.getMessageHistory();
        return messages.filter(msg => msg.event === event);
    }
};
exports.WebsocketService = WebsocketService;
exports.WebsocketService = WebsocketService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [websocket_gateway_1.WebsocketGateway])
], WebsocketService);
//# sourceMappingURL=websocket.service.js.map