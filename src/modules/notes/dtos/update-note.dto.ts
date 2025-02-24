import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateNoteDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'The contents of the note',
    example: 'My note',
  })
  public readonly contents?: string;
}
