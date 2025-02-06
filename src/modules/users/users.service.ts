import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import HashService from '../../shared/hash.service';
import { UserAuthenticationDto } from '../auth/dtos/authentication.dto';
import { User, UserDto } from './user.schema';

@Injectable()
export class UsersService {
  private readonly selectionProperties: {
    [Property in keyof Partial<User>]: 0 | 1;
  } = {
    id: 1,
    email: 1,
    createdAt: 1,
  };

  public constructor(
    @InjectModel(User.name)
    private readonly users: Model<User>,
    private readonly hashService: HashService,
  ) {}

  public async get(id: string): Promise<UserDto> {
    const user = await this.users
      .findOne({ id }, {}, { select: { ...this.selectionProperties, _id: 0 } })
      .lean();

    if (!user) {
      throw new NotFoundException();
    }

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  public async create({
    password,
    ...createUserDto
  }: UserAuthenticationDto): Promise<UserDto> {
    try {
      const user = await this.users.create({
        ...createUserDto,
        password: await this.hashService.hash(password),
      });

      const { id, createdAt } = user.toJSON();

      return { ...createUserDto, id, createdAt };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      throw new BadRequestException();
    }
  }

  public async update(
    id: string,
    updateUser: UserAuthenticationDto,
  ): Promise<void> {
    try {
      await this.users.updateOne({ id }, updateUser);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      throw new BadRequestException();
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      await this.users.deleteOne({ id });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      throw new BadRequestException();
    }
  }

  public async findOneForAuth(email: string) {
    const user = await this.users
      .findOne({ email })
      .select({
        email: 1,
        id: 1,
        password: 1,
        _id: 0,
      })
      .lean();

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      id: user.id,
      email: user.email,
      password: user.password,
    };
  }
}
