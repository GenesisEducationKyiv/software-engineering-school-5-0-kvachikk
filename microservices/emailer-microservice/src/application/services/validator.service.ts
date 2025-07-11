import { Injectable } from '@nestjs/common';

import { Letter } from '../../domain/types/letter';

@Injectable()
export class EmailValidationService {
   isValidEmail(email: string): boolean {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
   }

   isValidLetter({ from, to, subject, html, text }: Letter): boolean {
      if (!from || !this.isValidEmail(from)) {
         throw new Error(`Invalid sender email: "${from}"`);
      }
      if (!to || !this.isValidEmail(to)) {
         throw new Error(`Invalid recipient email: "${to}"`);
      }
      if (!subject) {
         throw new Error('Letter subject is required');
      }
      if (!html) {
         throw new Error('Letter html is required');
      }
      if (text) {
         throw new Error('Plain text should not be provided when html content is used');
      }
      return true;
   }
}
