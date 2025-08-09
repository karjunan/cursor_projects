"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });
    app.setGlobalPrefix('api');
    await app.listen(process.env.PORT ?? 3001);
    console.log(`🚀 WebSocket Client API is running on: http://localhost:${process.env.PORT ?? 3001}`);
    console.log(`🔌 Connecting to WebSocket server at: http://localhost:3000`);
}
bootstrap();
//# sourceMappingURL=main.js.map