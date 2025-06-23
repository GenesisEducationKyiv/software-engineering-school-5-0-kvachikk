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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { error, value: validatedValue } = this.schema.validate(value, {
         abortEarly: false,
         stripUnknown: true,
         allowUnknown: false,
      });

      if (error) {
         const errors: ValidationError[] = error.details.map((detail) => ({
            field: detail.path.join('.'),
            message: detail.message,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            value: detail.context?.value,
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
