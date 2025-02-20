import { IsNumber, IsString, Length } from 'class-validator';

export class CreateFolderDto {
  @IsString()
  @Length(0, 255)
  public readonly title: string;

  @IsNumber()
  public readonly order: number;
}
