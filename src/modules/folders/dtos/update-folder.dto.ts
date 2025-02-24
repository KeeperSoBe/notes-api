import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class UpdateFolderDto {
  @IsOptional()
  @IsString()
  @Length(0, 255)
  @ApiProperty({
    type: String,
    description: 'The folders title.',
    example: 'My Folder',
  })
  public readonly title?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'The order of the folder in the list, cannot be 0.',
    example: 1,
  })
  public readonly order?: number;
}
