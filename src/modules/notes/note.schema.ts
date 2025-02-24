import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

import { Base } from '../../shared/schemas/base.schema';

export type NoteDocument = HydratedDocument<Note>;

@Schema()
export class Note extends Base {
  @Prop({
    type: String,
    required: true,
  })
  public folderId: string;

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
  public contents: string;

  @Prop({
    type: Date,
    default: new Date(),
  })
  public updatedAt: Date;

  @Prop({
    type: Date || null,
    default: null,
  })
  public deletedAt: Date | null;
}

export const NoteSchema = SchemaFactory.createForClass(Note);

export class NoteDto
  extends Base
  implements Readonly<Omit<Note, 'userId' | 'deletedAt'>>
{
  @ApiProperty({
    type: String,
    required: false,
    example: '977e537c-fcc2-403f-9838-d9420a1a6801',
    description: 'The folder id of the note.',
  })
  public folderId: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Lorem ipsum',
    description: 'The notes contents.',
  })
  public contents: string;

  @ApiProperty({
    type: Date,
    example: 'Sat Jan 27 2024 12:00:00 GMT+0000 (Greenwich Mean Time)',
    description: 'The date timestamp the entity was created.',
  })
  public updatedAt: Date;
}
