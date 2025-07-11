import fs from 'node:fs';
import path from 'node:path';

import { Injectable } from '@nestjs/common';
import handlebars from 'handlebars';

@Injectable()
export class EmailTemplateService {
   compile(templatePath: string, templateVars: Record<string, unknown> = {}): string {
      const candidatePaths: string[] = [
         path.join(__dirname, '../../templates', templatePath),
         path.join(process.cwd(), 'src/templates', templatePath),
         path.join(process.cwd(), 'src/domain/templates', templatePath),
      ];

      const fullPath = candidatePaths.find((p) => fs.existsSync(p));
      if (!fullPath) {
         throw new Error(`Email template not found. Searched paths: ${candidatePaths.join(', ')}`);
      }

      const templateContent = fs.readFileSync(fullPath, 'utf8');
      const template = handlebars.compile(templateContent);
      return template(templateVars);
   }
}
