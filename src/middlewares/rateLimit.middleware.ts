// rate-limit.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import RateLimit from 'express-rate-limit';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  constructor() {}

  use(req: any, res: any, next: () => void) {
    return next();
  }

  initialize() {
    return RateLimit({
      windowMs: 5 * 60 * 1000, 
      max: 5,
      message: 'Rate limit exceeded, please try again later',
    });
  }
}
