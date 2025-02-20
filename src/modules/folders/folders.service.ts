import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Folder, FolderDto } from './folder.schema';
import { CreateFolderDto } from './dtos/create-folder.dto';
import { UpdateFolderDto } from './dtos/update-folder.dto';

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

  public async list(userId: string): Promise<FolderDto[]> {
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
  }

  public async create(
    userId: string,
    createFolderDto: CreateFolderDto,
  ): Promise<FolderDto> {
    try {
      const folders = await this.folders.create({ ...createFolderDto, userId });

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

      await this.folders.updateOne({ userId, id }, updateFolderDto);
      return updateFolderDto;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      throw new BadRequestException();
    }
  }

  public async delete(userId: string, id: string): Promise<void> {
    try {
      // TODO: This will change to soft deletion soon.
      await this.folders.deleteOne({ userId, id });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      throw new BadRequestException();
    }
  }

  private toFolderDto({ id, title, order, createdAt }: Folder): FolderDto {
    return { id, title, order, createdAt };
  }
}
