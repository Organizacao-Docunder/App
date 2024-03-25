import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CheckJsonInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (request.headers['content-type'] !== 'application/json') {
      throw new BadRequestException(
        'Invalid format. Please make your request using JSON and use the correct content-type header',
      );
    }
    return next.handle().pipe(
      map((data) => {
        return data;
      }),
    );
  }
}
