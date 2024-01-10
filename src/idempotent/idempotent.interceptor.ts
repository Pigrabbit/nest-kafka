import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { KafkaContext } from '@nestjs/microservices';
import { Observable, tap } from 'rxjs';
import { MessageIdempotentChecker } from './message-idempotent-checker';

@Injectable()
export class IdempotentInterceptor implements NestInterceptor {
  constructor(
    @Inject('MESSAGE_IDEMPOTENT_CHECKER') private readonly messageIdempotentChecker: MessageIdempotentChecker,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const kafkaContext = context.switchToRpc().getContext<KafkaContext>();
    const { value } = kafkaContext.getMessage();

    return next.handle().pipe(
      tap(() => {
        this.messageIdempotentChecker.markAsProcessed((value as any).id);
      }),
    );
  }
}
