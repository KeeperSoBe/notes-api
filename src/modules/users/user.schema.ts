import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

import { Base } from '../../shared/schemas/base.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends Base {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  public email: string;

  @Prop({
    type: String,
    required: true,
    select: false,
  })
  public password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export class UserDto extends Base implements Readonly<Omit<User, 'password'>> {
  @ApiProperty({
    type: String,
    required: true,
    example: 'dave@test.com',
    description: 'The users email address.',
  })
  public readonly email: string;
}
