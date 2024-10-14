import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const url = context.switchToHttp().getRequest().url;
    if (url.startsWith("/image")) {
      return next.handle();
    }

    const log = [
      context.switchToHttp().getRequest().method,
      context.switchToHttp().getRequest().url,
      context.switchToHttp().getRequest().ip,
    ];

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        log.push(`${Date.now() - now}ms`);
        console.log(log.join(", "));
      }),
    );
  }
}
