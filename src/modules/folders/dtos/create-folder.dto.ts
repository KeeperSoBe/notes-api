import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Length } from 'class-validator';

export class CreateFolderDto {
  @IsString()
  @Length(0, 255)
  @ApiProperty({
    type: String,
    required: true,
    description: 'The folders title.',
    example: 'My Folder',
  })
  public readonly title: string;

  @IsNumber()
  @ApiProperty({
    type: Number,
    required: true,
    description: 'The order of the folder in the list, cannot be 0.',
    example: 1,
  })
  public readonly order: number;
}
