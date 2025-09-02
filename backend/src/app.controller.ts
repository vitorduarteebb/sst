import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health Check')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Health check da API' })
  @ApiResponse({ status: 200, description: 'API funcionando' })
  getHello(): string {
    return '🚀 Plataforma SST API funcionando!';
  }

  @Get('health')
  @ApiOperation({ summary: 'Status da aplicação' })
  @ApiResponse({ status: 200, description: 'Status da aplicação' })
  getHealth(): object {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    };
  }
}
