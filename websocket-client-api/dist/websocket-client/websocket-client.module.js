"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketClientModule = void 0;
const common_1 = require("@nestjs/common");
const websocket_client_service_1 = require("./websocket-client.service");
const websocket_client_controller_1 = require("./websocket-client.controller");
let WebsocketClientModule = class WebsocketClientModule {
};
exports.WebsocketClientModule = WebsocketClientModule;
exports.WebsocketClientModule = WebsocketClientModule = __decorate([
    (0, common_1.Module)({
        providers: [websocket_client_service_1.WebsocketClientService],
        controllers: [websocket_client_controller_1.WebsocketClientController],
        exports: [websocket_client_service_1.WebsocketClientService],
    })
], WebsocketClientModule);
//# sourceMappingURL=websocket-client.module.js.map