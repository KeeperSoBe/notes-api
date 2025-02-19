import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDto } from './note.schema';
import { CreateNoteDto } from './dtos/create-note.dto';
import { UpdateNoteDto } from './dtos/update-note.dto';

@Injectable()
export class NotesService {
  private readonly selectionProperties: {
    [Property in keyof Partial<Note>]: 0 | 1;
  } = {
    id: 1,
    title: 1,
    contents: 1,
    createdAt: 1,
  };

  public constructor(
    @InjectModel(Note.name)
    private readonly notes: Model<Note>,
  ) {}

  public async get(
    userId: string,
    folderId: string,
    id: string,
  ): Promise<NoteDto> {
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

    return {
      id: note.id,
      title: note.title,
      contents: note.contents,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    };
  }

  public async list(userId: string, folderId: string): Promise<NoteDto[]> {
    const notes = await this.notes
      .find(
        { userId, folderId },
        {},
        { select: { ...this.selectionProperties, _id: 0 } },
      )
      .lean();

    const parsedNotes: NoteDto[] = [];

    for (let index = 0; index < notes.length; index++) {
      const { id, title, contents, createdAt, updatedAt } = notes[index];

      parsedNotes.push({
        id,
        title,
        contents,
        createdAt,
        updatedAt,
      });
    }

    return parsedNotes;
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

      const { id, title, contents, createdAt, updatedAt } = notes.toJSON();

      return { id, title, contents, createdAt, updatedAt };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      throw new BadRequestException();
    }
  }

  public async update(
    userId: string,
    folderId: string,
    id: string,
    updateNoteDto: UpdateNoteDto,
  ): Promise<void> {
    try {
      await this.notes.updateOne({ userId, folderId, id }, updateNoteDto);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      throw new BadRequestException();
    }
  }

  public async delete(
    userId: string,
    folderId: string,
    id: string,
  ): Promise<void> {
    try {
      await this.notes.deleteOne({ userId, folderId, id });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      throw new BadRequestException();
    }
  }
}
