export class ConflictError extends Error {
   status: number;

   constructor(message: string) {
      super(message);
      this.name = 'Conflict';
      this.status = 409;
   }
}
