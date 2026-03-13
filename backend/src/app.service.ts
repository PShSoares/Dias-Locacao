import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      service: 'dias-locacao-backend',
      timestamp: new Date().toISOString(),
    };
  }
}
