import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';
import { Base } from '../../shared/schemas/base.schema';
import { ApiProperty } from '@nestjs/swagger';

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
    type: String || null,
    default: null,
    required: false,
  })
  public title: string | null;

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
}

export const NoteSchema = SchemaFactory.createForClass(Note);

export class NoteDto extends Base implements Readonly<Omit<Note, 'userId'>> {
  @ApiProperty({
    type: String,
    required: false,
    example: '977e537c-fcc2-403f-9838-d9420a1a6801',
    description: 'The folder id of the note.',
  })
  public folderId: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'My note title',
    description: 'The title of the note.',
  })
  public title: string | null;

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
