import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { object, ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value !== 'object') return value; //otherwise this tries to validate parameter

    const { error } = this.schema.validate(value, { abortEarly: false });
    if (error) {
      throw new BadRequestException(error.message);
    }
    return value;
  }
}
