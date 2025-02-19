import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';
import { Base } from '../../shared/schemas/base.schema';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export type FolderDocument = HydratedDocument<Folder>;

@Schema()
export class Folder extends Base {
  @Prop({
    type: String,
    required: true,
    select: 0,
  })
  public userId: string;

  @Prop({
    type: String,
    required: true,
  })
  public title: string;
}

export const FolderSchema = SchemaFactory.createForClass(Folder);

export class FolderDto
  extends Base
  implements Readonly<Omit<Folder, 'userId'>>
{
  @ApiProperty({
    type: String,
    required: false,
    example: 'My folder title',
    description: 'The title of the folder.',
  })
  @IsString()
  @Length(0, 255)
  public title: string;
}
