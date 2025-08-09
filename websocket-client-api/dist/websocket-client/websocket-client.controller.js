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
var WebsocketClientController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketClientController = void 0;
const common_1 = require("@nestjs/common");
const websocket_client_service_1 = require("./websocket-client.service");
let WebsocketClientController = WebsocketClientController_1 = class WebsocketClientController {
    websocketClientService;
    logger = new common_1.Logger(WebsocketClientController_1.name);
    constructor(websocketClientService) {
        this.websocketClientService = websocketClientService;
    }
    async sendMessage(body) {
        try {
            this.logger.log(`Received REST request to send message: ${body.message}`);
            const response = await this.websocketClientService.sendMessage(body.message);
            this.logger.log(`Message sent successfully via WebSocket`);
            return {
                success: true,
                message: 'Message sent successfully via WebSocket',
                data: {
                    originalMessage: body.message,
                    websocketResponse: response,
                    timestamp: new Date().toISOString(),
                },
            };
        }
        catch (error) {
            this.logger.error(`Failed to send message: ${error.message}`);
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to send message via WebSocket',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async sendBroadcast(body) {
        try {
            this.logger.log(`Received REST request to send broadcast: ${body.message}`);
            const response = await this.websocketClientService.sendBroadcast(body.message);
            this.logger.log(`Broadcast sent successfully via WebSocket`);
            return {
                success: true,
                message: 'Broadcast sent successfully via WebSocket',
                data: {
                    originalMessage: body.message,
                    websocketResponse: response,
                    timestamp: new Date().toISOString(),
                },
            };
        }
        catch (error) {
            this.logger.error(`Failed to send broadcast: ${error.message}`);
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to send broadcast via WebSocket',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async sendPing(body) {
        try {
            this.logger.log('Received REST request to send ping');
            const response = await this.websocketClientService.sendPing();
            this.logger.log(`Ping sent successfully via WebSocket`);
            return {
                success: true,
                message: 'Ping sent successfully via WebSocket',
                data: {
                    websocketResponse: response,
                    timestamp: new Date().toISOString(),
                },
            };
        }
        catch (error) {
            this.logger.error(`Failed to send ping: ${error.message}`);
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to send ping via WebSocket',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getStatus() {
        try {
            const connectionStatus = this.websocketClientService.getConnectionStatus();
            const serverStatus = await this.websocketClientService.getServerStatus();
            return {
                success: true,
                data: {
                    client: {
                        connected: connectionStatus.connected,
                        connectionId: connectionStatus.connectionId,
                    },
                    server: serverStatus.data,
                    timestamp: new Date().toISOString(),
                },
            };
        }
        catch (error) {
            this.logger.error(`Failed to get status: ${error.message}`);
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to get status',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getConnections() {
        try {
            const connections = await this.websocketClientService.getConnections();
            return {
                success: true,
                data: {
                    connections: connections.data,
                    timestamp: new Date().toISOString(),
                },
            };
        }
        catch (error) {
            this.logger.error(`Failed to get connections: ${error.message}`);
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to get connections',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getHealth() {
        const connectionStatus = this.websocketClientService.getConnectionStatus();
        return {
            status: connectionStatus.connected ? 'healthy' : 'unhealthy',
            websocket: {
                connected: connectionStatus.connected,
                connectionId: connectionStatus.connectionId,
            },
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        };
    }
    async sendBulkMessages(body) {
        try {
            this.logger.log(`Received REST request to send ${body.messages.length} messages`);
            const results = [];
            for (const message of body.messages) {
                try {
                    const response = await this.websocketClientService.sendMessage(message);
                    results.push({
                        message,
                        success: true,
                        response,
                    });
                }
                catch (error) {
                    results.push({
                        message,
                        success: false,
                        error: error.message,
                    });
                }
            }
            const successCount = results.filter(r => r.success).length;
            const failureCount = results.length - successCount;
            return {
                success: true,
                message: `Bulk messages sent: ${successCount} successful, ${failureCount} failed`,
                data: {
                    total: body.messages.length,
                    successful: successCount,
                    failed: failureCount,
                    results,
                    timestamp: new Date().toISOString(),
                },
            };
        }
        catch (error) {
            this.logger.error(`Failed to send bulk messages: ${error.message}`);
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to send bulk messages',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async sendBulkPings(body) {
        try {
            this.logger.log(`Received REST request to send ${body.count} pings`);
            const results = [];
            for (let i = 0; i < body.count; i++) {
                try {
                    const response = await this.websocketClientService.sendPing();
                    results.push({
                        pingNumber: i + 1,
                        success: true,
                        response,
                    });
                }
                catch (error) {
                    results.push({
                        pingNumber: i + 1,
                        success: false,
                        error: error.message,
                    });
                }
            }
            const successCount = results.filter(r => r.success).length;
            const failureCount = results.length - successCount;
            return {
                success: true,
                message: `Bulk pings sent: ${successCount} successful, ${failureCount} failed`,
                data: {
                    total: body.count,
                    successful: successCount,
                    failed: failureCount,
                    results,
                    timestamp: new Date().toISOString(),
                },
            };
        }
        catch (error) {
            this.logger.error(`Failed to send bulk pings: ${error.message}`);
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to send bulk pings',
                error: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.WebsocketClientController = WebsocketClientController;
__decorate([
    (0, common_1.Post)('message'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WebsocketClientController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Post)('broadcast'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WebsocketClientController.prototype, "sendBroadcast", null);
__decorate([
    (0, common_1.Post)('ping'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WebsocketClientController.prototype, "sendPing", null);
__decorate([
    (0, common_1.Get)('status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WebsocketClientController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Get)('connections'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WebsocketClientController.prototype, "getConnections", null);
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WebsocketClientController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Post)('bulk/messages'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WebsocketClientController.prototype, "sendBulkMessages", null);
__decorate([
    (0, common_1.Post)('bulk/pings'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WebsocketClientController.prototype, "sendBulkPings", null);
exports.WebsocketClientController = WebsocketClientController = WebsocketClientController_1 = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [websocket_client_service_1.WebsocketClientService])
], WebsocketClientController);
//# sourceMappingURL=websocket-client.controller.js.map