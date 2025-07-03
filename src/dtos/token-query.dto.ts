import { ApiPropertyOptional } from '@nestjs/swagger';

export class TokenQueryDto {
   @ApiPropertyOptional({
      type: String,
      description: 'Token provided in email',
      example: 'abc123xyz',
   })
   token: string;
}
