import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import type { Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Get('test-client')
  getTestClient(@Res() res: Response) {
    try {
      const htmlPath = join(__dirname, '../../public/index.html');
      const html = readFileSync(htmlPath, 'utf8');
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } catch (error) {
      res.status(500).send('Error loading test client');
    }
  }
}
