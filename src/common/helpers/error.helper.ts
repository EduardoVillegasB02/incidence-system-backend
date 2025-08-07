import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

export function handleErrors(error: any, model: string): never {
  const logger = new Logger(model);
  if (error instanceof HttpException) throw error;
  if (error.code === '23505') throw new BadRequestException(error.detail);
  if (error.code === '11000')
    throw new BadRequestException(
      `Duplicate value for field: ${Object.keys(error.keyValue || {})[0]}`,
    );
  logger.error(error);
  throw new InternalServerErrorException('Internal Error. Review logs');
}
