import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';
import { Base } from '../../shared/schemas/base.schema';
import { ApiProperty } from '@nestjs/swagger';

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
    type: Number,
    required: false,
  })
  public order: number;

  @Prop({
    type: String,
    required: true,
  })
  public title: string;

  @Prop({
    type: Date || null,
    default: null,
  })
  public deletedAt: Date | null;
}

export const FolderSchema = SchemaFactory.createForClass(Folder);

export class FolderDto
  extends Base
  implements Readonly<Omit<Folder, 'userId' | 'deletedAt'>>
{
  @ApiProperty({
    type: String,
    required: false,
    example: 'My folder title',
    description: 'The title of the folder.',
  })
  public title: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 0,
    description: 'The order of the folder.',
  })
  public order: number;
}
