import { BadRequestException } from '@nestjs/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CheckJson = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (request.headers['content-type'] !== 'application/json') {
      throw new BadRequestException(
        'Invalid format. Please make your request using JSON and use the correct content-type header',
      );
    }
    return request.body;
  },
);
