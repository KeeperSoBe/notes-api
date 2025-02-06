import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { HydratedDocument } from 'mongoose';

export type BaseDocument = HydratedDocument<Base>;

@Schema()
export class Base {
  @Prop({
    type: String,
    default: () => randomUUID(),
    unique: true,
  })
  @ApiProperty({
    type: String,
    example: '977e537c-fcc2-403f-9838-d9420a1a6801',
    description: 'The id of the entity.',
  })
  public readonly id: string;

  @Prop({
    type: Date,
    default: new Date(),
  })
  @ApiProperty({
    type: Date,
    example: 'Sat Jan 27 2024 12:00:00 GMT+0000 (Greenwich Mean Time)',
    description: 'The date timestamp the entity was created.',
  })
  public readonly createdAt: Date;
}

export const BaseSchema = SchemaFactory.createForClass(Base);
