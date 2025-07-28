import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Inject,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

import { REQUEST_METRICS, RequestMetrics } from './metrics.module';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(
    @Inject(REQUEST_METRICS) private readonly metrics: RequestMetrics,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method: string = req.method;
    const start = process.hrtime();

    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse();
        const status: number = res.statusCode;
        this.metrics.requestCounter.inc({ method, status });
        const diff = process.hrtime(start);
        const seconds = diff[0] + diff[1] / 1e9;
        this.metrics.durationHistogram.observe({ method, status }, seconds);
      }),
    );
  }
}
