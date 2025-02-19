import { IsString, Length } from 'class-validator';

export class UpsertFolderDto {
  @IsString()
  @Length(0, 255)
  public readonly title: string;
}
