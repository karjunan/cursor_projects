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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketController = void 0;
const common_1 = require("@nestjs/common");
const websocket_service_1 = require("./websocket.service");
let WebsocketController = class WebsocketController {
    websocketService;
    constructor(websocketService) {
        this.websocketService = websocketService;
    }
    getServerStatus() {
        try {
            return {
                status: 'success',
                data: this.websocketService.getServerStatus(),
            };
        }
        catch (error) {
            throw new common_1.HttpException('Failed to get WebSocket status', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    getConnections() {
        try {
            return {
                status: 'success',
                data: {
                    connections: this.websocketService.getConnections().map(conn => ({
                        ...conn,
                        connectedAt: conn.connectedAt.toISOString(),
                        lastActivity: conn.lastActivity.toISOString(),
                    })),
                    count: this.websocketService.getConnectionCount(),
                },
            };
        }
        catch (error) {
            throw new common_1.HttpException('Failed to get connections', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    getConnection(connectionId) {
        try {
            const connection = this.websocketService.getConnectionById(connectionId);
            if (!connection) {
                throw new common_1.HttpException('Connection not found', common_1.HttpStatus.NOT_FOUND);
            }
            return {
                status: 'success',
                data: {
                    ...connection,
                    connectedAt: connection.connectedAt.toISOString(),
                    lastActivity: connection.lastActivity.toISOString(),
                },
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Failed to get connection', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    getMessages(query) {
        try {
            let messages;
            if (query.connectionId) {
                messages = this.websocketService.getMessagesByConnection(query.connectionId);
            }
            else if (query.event) {
                messages = this.websocketService.getMessagesByEvent(query.event);
            }
            else {
                messages = this.websocketService.getRecentMessages(query.count || 10);
            }
            return {
                status: 'success',
                data: {
                    messages: messages.map(msg => ({
                        ...msg,
                        timestamp: msg.timestamp.toISOString(),
                    })),
                    count: messages.length,
                },
            };
        }
        catch (error) {
            throw new common_1.HttpException('Failed to get messages', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    sendCommand(command) {
        try {
            switch (command.action) {
                case 'broadcast':
                    const broadcastSuccess = this.websocketService.broadcast(command.event || 'message', command.data);
                    if (!broadcastSuccess) {
                        throw new common_1.HttpException('Failed to broadcast message', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                    return {
                        status: 'success',
                        message: 'Message broadcasted to all connections',
                        data: { event: command.event, data: command.data },
                    };
                case 'sendToConnection':
                    if (!command.connectionId) {
                        throw new common_1.HttpException('connectionId is required for sendToConnection action', common_1.HttpStatus.BAD_REQUEST);
                    }
                    if (!this.websocketService.connectionExists(command.connectionId)) {
                        throw new common_1.HttpException('Connection not found', common_1.HttpStatus.NOT_FOUND);
                    }
                    const sendSuccess = this.websocketService.sendToConnection(command.connectionId, command.event || 'message', command.data);
                    if (!sendSuccess) {
                        throw new common_1.HttpException('Failed to send message to connection', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                    return {
                        status: 'success',
                        message: `Message sent to connection ${command.connectionId}`,
                        data: { connectionId: command.connectionId, event: command.event, data: command.data },
                    };
                case 'disconnectConnection':
                    if (!command.connectionId) {
                        throw new common_1.HttpException('connectionId is required for disconnectConnection action', common_1.HttpStatus.BAD_REQUEST);
                    }
                    if (!this.websocketService.connectionExists(command.connectionId)) {
                        throw new common_1.HttpException('Connection not found', common_1.HttpStatus.NOT_FOUND);
                    }
                    const disconnectSuccess = this.websocketService.disconnectConnection(command.connectionId);
                    if (!disconnectSuccess) {
                        throw new common_1.HttpException('Failed to disconnect connection', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                    return {
                        status: 'success',
                        message: `Connection ${command.connectionId} disconnected`,
                    };
                case 'disconnectAll':
                    const disconnectAllSuccess = this.websocketService.disconnectAll();
                    if (!disconnectAllSuccess) {
                        throw new common_1.HttpException('Failed to disconnect all connections', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                    return {
                        status: 'success',
                        message: 'All connections disconnected',
                    };
                default:
                    throw new common_1.HttpException('Invalid action. Use: broadcast, sendToConnection, disconnectConnection, or disconnectAll', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Failed to process WebSocket command', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    broadcast(body) {
        try {
            const success = this.websocketService.broadcast(body.event || 'message', body.data);
            if (!success) {
                throw new common_1.HttpException('Failed to broadcast message', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return {
                status: 'success',
                message: 'Message broadcasted to all connections',
                data: { event: body.event, data: body.data },
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Failed to broadcast message', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    sendToConnection(connectionId, body) {
        try {
            if (!this.websocketService.connectionExists(connectionId)) {
                throw new common_1.HttpException('Connection not found', common_1.HttpStatus.NOT_FOUND);
            }
            const success = this.websocketService.sendToConnection(connectionId, body.event || 'message', body.data);
            if (!success) {
                throw new common_1.HttpException('Failed to send message to connection', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return {
                status: 'success',
                message: `Message sent to connection ${connectionId}`,
                data: { connectionId, event: body.event, data: body.data },
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Failed to send message to connection', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    disconnectConnection(connectionId) {
        try {
            if (!this.websocketService.connectionExists(connectionId)) {
                throw new common_1.HttpException('Connection not found', common_1.HttpStatus.NOT_FOUND);
            }
            const success = this.websocketService.disconnectConnection(connectionId);
            if (!success) {
                throw new common_1.HttpException('Failed to disconnect connection', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return {
                status: 'success',
                message: `Connection ${connectionId} disconnected`,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Failed to disconnect connection', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    disconnectAll() {
        try {
            const success = this.websocketService.disconnectAll();
            if (!success) {
                throw new common_1.HttpException('Failed to disconnect all connections', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return {
                status: 'success',
                message: 'All connections disconnected',
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Failed to disconnect all connections', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.WebsocketController = WebsocketController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WebsocketController.prototype, "getServerStatus", null);
__decorate([
    (0, common_1.Get)('connections'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WebsocketController.prototype, "getConnections", null);
__decorate([
    (0, common_1.Get)('connections/:connectionId'),
    __param(0, (0, common_1.Param)('connectionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WebsocketController.prototype, "getConnection", null);
__decorate([
    (0, common_1.Get)('messages'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WebsocketController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WebsocketController.prototype, "sendCommand", null);
__decorate([
    (0, common_1.Post)('broadcast'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WebsocketController.prototype, "broadcast", null);
__decorate([
    (0, common_1.Post)('connections/:connectionId/send'),
    __param(0, (0, common_1.Param)('connectionId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WebsocketController.prototype, "sendToConnection", null);
__decorate([
    (0, common_1.Post)('connections/:connectionId/disconnect'),
    __param(0, (0, common_1.Param)('connectionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WebsocketController.prototype, "disconnectConnection", null);
__decorate([
    (0, common_1.Post)('disconnect-all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WebsocketController.prototype, "disconnectAll", null);
exports.WebsocketController = WebsocketController = __decorate([
    (0, common_1.Controller)('websocket'),
    __metadata("design:paramtypes", [websocket_service_1.WebsocketService])
], WebsocketController);
//# sourceMappingURL=websocket.controller.js.map