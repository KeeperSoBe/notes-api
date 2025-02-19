import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateNoteDto {
  @IsOptional()
  @IsString()
  @Length(0, 255)
  public readonly title?: string | null;

  @IsOptional()
  @IsString()
  public readonly contents?: string;
}
