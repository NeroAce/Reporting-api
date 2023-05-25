import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { LogRepository } from 'libs/repositories/log.repository';
import { catchError, tap } from 'rxjs';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  constructor(private logRepository: LogRepository) {}
  async intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    const data = {
      method: request.method,
      url: request.url,
      query: JSON.stringify(request.query),
      body: JSON.stringify(request.body),
      date: new Date().toLocaleDateString('en-IN'),
      time: new Date().toLocaleTimeString('en-IN'),
      status: 'Success',
    };

    return next.handle().pipe(
      tap(async (result) => {
        const send = this.logRepository.createRequestLog(data);
        console.log(send);
      }),
      catchError((error) => {
        // console.error('Error in controller:', error.response);
        data['message'] = JSON.stringify(error.response.message);
        data.status = 'failed';
        const send = this.logRepository.createRequestLog(data);
        console.log(send);

        throw error; // Re-throw the error to propagate it to the global error handling mechanism
      }),
    );
  }
}
