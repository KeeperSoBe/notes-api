import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateFolderDto } from './dtos/create-folder.dto';
import { UpdateFolderDto } from './dtos/update-folder.dto';
import { Folder, FolderDto } from './folder.schema';

@Injectable()
export class FoldersService {
  private readonly selectionProperties: {
    [Property in keyof Partial<Folder>]: 0 | 1;
  } = {
    id: 1,
    title: 1,
    order: 1,
    createdAt: 1,
  };

  public constructor(
    @InjectModel(Folder.name)
    private readonly folders: Model<Folder>,
  ) {}

  public async get(userId: string, id: string): Promise<FolderDto> {
    try {
      const folder = await this.folders
        .findOne(
          { userId, id, deletedAt: null },
          {},
          { select: { ...this.selectionProperties, _id: 0 } },
        )
        .lean();

      if (!folder) {
        throw new NotFoundException();
      }

      return this.toFolderDto(folder);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new NotFoundException();
    }
  }

  public async list(userId: string): Promise<FolderDto[]> {
    try {
      const folders = await this.folders
        .find(
          { userId, deletedAt: null },
          {},
          { select: { ...this.selectionProperties, _id: 0 } },
        )
        .lean();

      const parsedFolders: FolderDto[] = [];

      for (let index = 0; index < folders.length; index++) {
        parsedFolders.push(this.toFolderDto(folders[index]));
      }

      return parsedFolders;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException();
    }
  }

  public async create(
    userId: string,
    createFolderDto: CreateFolderDto,
  ): Promise<FolderDto> {
    try {
      if (createFolderDto.order === 0) {
        throw new BadRequestException();
      }

      const folders = await this.folders.create({ ...createFolderDto, userId });

      return this.toFolderDto(folders.toJSON());
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      throw new BadRequestException();
    }
  }

  public async createDefaultFolder(userId: string): Promise<FolderDto> {
    try {
      const folders = await this.folders.create({
        userId,
        title: 'Notes',
        order: 0,
      });

      return this.toFolderDto(folders.toJSON());
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      throw new BadRequestException();
    }
  }

  public async update(
    userId: string,
    id: string,
    updateFolderDto: UpdateFolderDto,
  ): Promise<UpdateFolderDto> {
    try {
      if (updateFolderDto.order === 0) {
        // 0 Is the default folder
        throw new BadRequestException();
      }

      const { upsertedCount } = await this.folders.updateOne(
        { userId, id, order: { $ne: 0 } },
        updateFolderDto,
      );

      if (!upsertedCount) {
        throw new NotFoundException();
      }

      return updateFolderDto;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      throw new BadRequestException();
    }
  }

  public async delete(userId: string, id: string): Promise<void> {
    try {
      const { deletedCount } = await this.folders.deleteOne({
        userId,
        id,
        order: { $ne: 0 },
      });

      if (!deletedCount) {
        throw new NotFoundException();
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      throw new BadRequestException();
    }
  }

  private toFolderDto({ id, title, order, createdAt }: Folder): FolderDto {
    return { id, title, order, createdAt };
  }
}
