import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class UpdateFolderDto {
  @IsOptional()
  @IsString()
  @Length(0, 255)
  public readonly title?: string;

  @IsOptional()
  @IsNumber()
  public readonly order?: number;
}
