import { IsOptional, IsString, Length } from 'class-validator';

export class CreateNoteDto {
  @IsOptional()
  @IsString()
  @Length(0, 255)
  public readonly title: string | null;

  @IsString()
  public readonly contents: string;
}
