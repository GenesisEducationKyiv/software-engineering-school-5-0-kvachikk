import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectSchema } from 'joi';

interface ValidationError {
   field: string;
   message: string;
   value?: unknown;
}

interface ValidationResponse {
   success: boolean;
   message: string;
   errors: ValidationError[];
}

@Injectable()
export class JoiValidationPipe implements PipeTransform<unknown, unknown> {
   constructor(private readonly schema: ObjectSchema) {}

   transform(value: unknown): unknown {
      const start = process.hrtime();
      const { error, value: validatedValue } = this.schema.validate(value, {
         abortEarly: false,
         stripUnknown: true,
         allowUnknown: false,
      });

      if (error) {
         const diff: [number, number] = process.hrtime(start);
         const seconds = diff[0] + diff[1] / 1e9;
         const errors: ValidationError[] = error.details.map((detail) => ({
            field: detail.path.join('.'),
            message: detail.message,
            value: detail.context?.value as string,
         }));

         const validationResponse: ValidationResponse = {
            success: false,
            message: 'Validation failed',
            errors,
         };

         throw new BadRequestException(validationResponse);
      }

      return validatedValue;
   }
}
