import fs from 'node:fs';
import path from 'node:path';

import { Injectable } from '@nestjs/common';
import handlebars from 'handlebars';

@Injectable()
export class EmailTemplateService {
   public compile(templatePath: string, templateVars: Record<string, unknown> = {}): string {
      let fullPath = path.join(__dirname, '../../constants/templates', templatePath);

      if (!fs.existsSync(fullPath)) {
         fullPath = path.join(process.cwd(), 'src/constants/templates', templatePath);
      }

      if (!fs.existsSync(fullPath)) {
         throw new Error(`Email template not found at path: ${templatePath}`);
      }

      const templateContent = fs.readFileSync(fullPath, 'utf8');
      const template = handlebars.compile(templateContent);
      return template(templateVars);
   }
}
