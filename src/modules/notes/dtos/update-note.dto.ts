import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

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
  @IsBoolean()
  @ApiProperty({
    type: 'null',
    required: false,
    example: null,
    description:
      'Restores a soft deleted note if provided, must be used with folderId.',
  })
  public deletedAt?: null;
}
