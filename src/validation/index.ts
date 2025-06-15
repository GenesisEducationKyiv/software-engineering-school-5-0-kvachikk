import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectSchema } from 'joi';

interface IValidationError {
   field: string;
   message: string;
   value?: any;
}

interface IValidationResponse {
   success: boolean;
   message: string;
   errors: IValidationError[];
}

@Injectable()
export class JoiValidationPipe implements PipeTransform {
   constructor(private readonly schema: ObjectSchema) {}

   transform(value: any): any {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { error, value: validatedValue } = this.schema.validate(value, {
         abortEarly: false,
         stripUnknown: true,
         allowUnknown: false,
      });

      if (error) {
         const errors: IValidationError[] = error.details.map((detail) => ({
            field: detail.path.join('.'),
            message: detail.message,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            value: detail.context?.value,
         }));

         const validationResponse: IValidationResponse = {
            success: false,
            message: 'Validation failed',
            errors,
         };

         throw new BadRequestException(validationResponse);
      }

      return validatedValue;
   }
}
