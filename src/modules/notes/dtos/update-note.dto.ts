import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class UpdateNoteDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'The contents of the note',
    example: 'My note',
  })
  public readonly contents?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    required: false,
    example: '977e537c-fcc2-403f-9838-d9420a1a6801',
    description: 'The folder id of the note.',
  })
  public folderId?: string;

  @IsOptional()
  @IsDateString()
  @ValidateIf((_object, value) => value !== null)
  @ApiProperty({
    type: Date || 'null',
    required: false,
    example: null,
    description:
      'Soft deletes a note if provided a date, if null is provided with a folderId the note will be restored.',
  })
  public deletedAt?: Date | null;
}
