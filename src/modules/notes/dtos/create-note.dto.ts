import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @ApiProperty({
    type: String,
    required: true,
    description: 'The contents of the note',
    example: 'My note',
  })
  public readonly contents: string;
}
