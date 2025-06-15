export interface TemplateLetterParams {
   to: string;
   subject: string;
   templatePath: string;
   templateVars?: Record<string, any>;
   text?: string;
}
