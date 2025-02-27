import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import BaseService from '../../shared/services/base.service';
import { CreateFolderDto } from './dtos/create-folder.dto';
import { UpdateFolderDto } from './dtos/update-folder.dto';
import { Folder, FolderDto } from './folder.schema';

@Injectable()
export class FoldersService extends BaseService {
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
  ) {
    super();
  }

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
    } catch (error) {
      this.throwError(error);
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
    } catch (error) {
      this.throwError(error);
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
    } catch (error) {
      this.throwError(error);
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
    } catch (error) {
      this.throwError(error);
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

      const { matchedCount } = await this.folders.updateOne(
        { userId, id, order: { $ne: 0 } },
        updateFolderDto,
      );

      if (!matchedCount) {
        throw new NotFoundException();
      }

      return updateFolderDto;
    } catch (error) {
      this.throwError(error);
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
    } catch (error) {
      this.throwError(error);
    }
  }

  private toFolderDto({ id, title, order, createdAt }: Folder): FolderDto {
    return { id, title, order, createdAt };
  }
}
