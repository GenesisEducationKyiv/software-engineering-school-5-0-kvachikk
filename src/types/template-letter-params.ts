export type TemplateLetterParams = {
   to: string;
   subject: string;
   templatePath: string;
   templateVars?: Record<string, unknown>;
   text?: string;
};
