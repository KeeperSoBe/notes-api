import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import BaseService from '../../shared/services/base.service';
import HashService from '../../shared/services/hash.service';
import { UserAuthenticationDto } from '../auth/dtos/authentication.dto';
import { FoldersService } from '../folders/folders.service';
import { User, UserDto } from './user.schema';

@Injectable()
export class UsersService extends BaseService {
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
    private readonly foldersService: FoldersService,
    private readonly hashService: HashService,
  ) {
    super();
  }

  public async get(id: string): Promise<UserDto> {
    try {
      const user = await this.users
        .findOne(
          { id },
          {},
          { select: { ...this.selectionProperties, _id: 0 } },
        )
        .lean();

      if (!user) {
        throw new NotFoundException();
      }

      return {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      };
    } catch (error) {
      this.throwError(error);
    }
  }

  public async create({
    password,
    ...createUserDto
  }: UserAuthenticationDto): Promise<UserDto> {
    try {
      let createdUser: {
        id: string;
        createdAt: Date;
      };

      try {
        const user = await this.users.create({
          ...createUserDto,
          password: await this.hashService.hash(password),
        });

        const { id, createdAt } = user.toJSON();

        createdUser = {
          id,
          createdAt,
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        throw new BadRequestException();
      }

      await this.foldersService.createDefaultFolder(createdUser.id);

      return { ...createUserDto, ...createdUser };
    } catch (error) {
      this.throwError(error);
    }
  }

  public async update(
    id: string,
    updateUser: UserAuthenticationDto,
  ): Promise<void> {
    try {
      await this.users.updateOne({ id }, updateUser);
    } catch (error) {
      this.throwError(error);
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      await this.users.deleteOne({ id });
    } catch (error) {
      this.throwError(error);
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
