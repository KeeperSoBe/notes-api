import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { DeletedAtDto } from '../../shared/dtos/deleted-at.dto';
import BaseService from '../../shared/services/base.service';
import { CreateNoteDto } from './dtos/create-note.dto';
import { UpdateNoteDto } from './dtos/update-note.dto';
import { Note, NoteDto } from './note.schema';

@Injectable()
export class NotesService extends BaseService {
  private readonly selectionProperties: {
    [Property in keyof Partial<Note>]: 0 | 1;
  } = {
    folderId: 1,
    id: 1,
    contents: 1,
    createdAt: 1,
    updatedAt: 1,
  };

  public constructor(
    @InjectModel(Note.name)
    private readonly notes: Model<Note>,
  ) {
    super();
  }

  public async get(
    userId: string,
    folderId: string,
    id: string,
  ): Promise<NoteDto> {
    try {
      const note = await this.notes
        .findOne(
          { userId, folderId, id },
          {},
          { select: { ...this.selectionProperties, _id: 0 } },
        )
        .lean();

      if (!note) {
        throw new NotFoundException();
      }

      return this.toNoteDto(note);
    } catch (error) {
      this.throwError(error);
    }
  }

  public async list(userId: string, folderId: string): Promise<NoteDto[]> {
    try {
      const notes = await this.notes
        .find(
          { userId, folderId, deletedAt: null },
          {},
          { select: { ...this.selectionProperties, _id: 0 } },
        )
        .lean();

      const parsedNotes: NoteDto[] = [];

      for (let index = 0; index < notes.length; index++) {
        parsedNotes.push(this.toNoteDto(notes[index]));
      }

      return parsedNotes;
    } catch (error) {
      this.throwError(error);
    }
  }

  public async listSoftDeleted(
    userId: string,
  ): Promise<(NoteDto & DeletedAtDto)[]> {
    try {
      const notes = await this.notes
        .find(
          { userId, deletedAt: { $ne: null } },
          {},
          { select: { ...this.selectionProperties, deletedAt: 1, _id: 0 } },
        )
        .lean();

      const parsedFolders: (NoteDto & DeletedAtDto)[] = [];

      for (let index = 0; index < notes.length; index++) {
        const deletedAt = notes[index].deletedAt;

        if (deletedAt) {
          parsedFolders.push({
            ...this.toNoteDto(notes[index]),
            deletedAt,
          });
        }
      }

      return parsedFolders;
    } catch (error) {
      this.throwError(error);
    }
  }

  public async create(
    userId: string,
    folderId: string,
    createNoteDto: CreateNoteDto,
  ): Promise<NoteDto> {
    try {
      const notes = await this.notes.create({
        ...createNoteDto,
        userId,
        folderId,
      });

      return this.toNoteDto(notes.toJSON());
    } catch (error) {
      this.throwError(error);
    }
  }

  public async update(
    userId: string,
    folderId: string,
    id: string,
    updateNoteDto: UpdateNoteDto,
  ): Promise<UpdateNoteDto> {
    try {
      if (updateNoteDto.deletedAt === null && !updateNoteDto.folderId) {
        throw new BadRequestException();
      }

      const { modifiedCount } = await this.notes.updateOne(
        { userId, folderId, id },
        updateNoteDto,
      );

      if (!modifiedCount) {
        throw new NotFoundException();
      }

      return updateNoteDto;
    } catch (error) {
      this.throwError(error);
    }
  }

  public async softDelete(
    userId: string,
    folderId: string,
    id: string,
  ): Promise<DeletedAtDto> {
    try {
      const deletedAt = new Date();

      const { modifiedCount } = await this.notes.updateOne(
        { userId, folderId, id, deletedAt: null },
        { deletedAt },
      );

      if (!modifiedCount) {
        throw new NotFoundException();
      }

      return { deletedAt };
    } catch (error) {
      this.throwError(error);
    }
  }

  public async delete(
    userId: string,
    folderId: string,
    id: string,
  ): Promise<void> {
    try {
      const { deletedCount } = await this.notes.deleteOne({
        userId,
        folderId,
        id,
      });

      if (!deletedCount) {
        throw new NotFoundException();
      }
    } catch (error) {
      this.throwError(error);
    }
  }

  private toNoteDto({
    folderId,
    id,
    contents,
    createdAt,
    updatedAt,
  }: Note): NoteDto {
    return { folderId, id, contents, createdAt, updatedAt };
  }
}
