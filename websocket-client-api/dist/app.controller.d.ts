import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): {
        message: string;
        description: string;
        version: string;
        endpoints: {
            'POST /api/message': string;
            'POST /api/broadcast': string;
            'POST /api/ping': string;
            'GET /api/status': string;
            'GET /api/connections': string;
            'GET /api/health': string;
            'POST /api/bulk/messages': string;
            'POST /api/bulk/pings': string;
        };
        websocketServer: string;
    };
    test(): string;
}
