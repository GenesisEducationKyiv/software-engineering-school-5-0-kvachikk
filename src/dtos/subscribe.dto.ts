import { ApiProperty } from '@nestjs/swagger';

export class SubscribeDto {
   @ApiProperty({ example: 'user@example.com', description: 'Email of the subscriber' })
   email: string;

   @ApiProperty({ example: 'Kyiv', description: 'City for which the weather forecast is requested' })
   city: string;

   @ApiProperty({ example: 'daily', description: 'Frequency of email notifications' })
   frequency: string;
}
