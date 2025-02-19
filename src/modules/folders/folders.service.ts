import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Folder, FolderDto } from './folder.schema';
import { UpsertFolderDto } from './dtos/upsert-folder.dto';

@Injectable()
export class FoldersService {
  private readonly selectionProperties: {
    [Property in keyof Partial<Folder>]: 0 | 1;
  } = {
    id: 1,
    title: 1,
    createdAt: 1,
  };

  public constructor(
    @InjectModel(Folder.name)
    private readonly folders: Model<Folder>,
  ) {}

  public async list(userId: string): Promise<FolderDto[]> {
    const folders = await this.folders
      .find({ userId }, {}, { select: { ...this.selectionProperties, _id: 0 } })
      .lean();

    const parsedFolders: FolderDto[] = [];

    for (let index = 0; index < folders.length; index++) {
      const { id, title, createdAt } = folders[index];

      parsedFolders.push({
        id,
        title,
        createdAt,
      });
    }

    return parsedFolders;
  }

  public async create(
    userId: string,
    upsertFolderDto: UpsertFolderDto,
  ): Promise<FolderDto> {
    try {
      const folders = await this.folders.create({ ...upsertFolderDto, userId });

      const { id, title, createdAt } = folders.toJSON();

      return { id, title, createdAt };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      throw new BadRequestException();
    }
  }

  public async update(
    userId: string,
    id: string,
    upsertFolderDto: UpsertFolderDto,
  ): Promise<void> {
    try {
      await this.folders.updateOne({ userId, id }, upsertFolderDto);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      throw new BadRequestException();
    }
  }

  public async delete(userId: string, id: string): Promise<void> {
    try {
      await this.folders.deleteOne({ userId, id });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      throw new BadRequestException();
    }
  }
}
