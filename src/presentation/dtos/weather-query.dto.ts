import { ApiProperty } from '@nestjs/swagger';

export class WeatherQueryDto {
   @ApiProperty({
      type: String,
      description: 'City name',
      example: 'Kyiv',
   })
   city: string;
}
