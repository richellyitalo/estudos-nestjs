import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseIdAsNumberPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param' || metadata.data !== 'id') {
      return value;
    }

    const valueAsNumber = Number(value);

    if (isNaN(valueAsNumber)) {
      throw new BadRequestException('O valor do ID precisa ser um número.');
    }

    if (valueAsNumber < 0) {
      throw new BadRequestException(
        'Informe um número superior ou igual a zero.',
      );
    }

    return valueAsNumber;
  }
}
