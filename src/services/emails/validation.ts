import { Injectable } from '@nestjs/common';
import { validationMessages } from '../../constants/message/validation';
import { Letter } from '../../interfaces/Letter';

@Injectable()
export class EmailValidationService {
   isValidEmail(email: string): boolean {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
   }

   isValidLetter({ from, to, subject, html, text }: Letter): boolean {
      if (!from || !this.isValidEmail(from)) {
         throw new Error(`${validationMessages.LETTER_SENDER_INVALID}"${from}"`);
      }
      if (!to || !this.isValidEmail(to)) {
         throw new Error(`${validationMessages.LETTER_RECIPIENT_INVALID}"${to}"`);
      }
      if (!subject) {
         throw new Error(validationMessages.LETTER_SUBJECT_REQUIRED);
      }
      if (!html) {
         throw new Error(validationMessages.LETTER_HTML_REQUIRED);
      }
      if (text) {
         throw new Error(validationMessages.LETTER_TEXT_INVALID);
      }
      return true;
   }
}
