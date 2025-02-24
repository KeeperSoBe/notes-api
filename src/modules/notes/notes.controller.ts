import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { DeletedAtDto } from '../../shared/dtos/deleted-at.dto';
import {
  AuthenticatedRequest,
  FindOneByIdParam,
} from '../../shared/interfaces/request.interface';
import { IUnauthorizedException } from '../../shared/interfaces/swagger.interface';
import { CreateNoteDto } from './dtos/create-note.dto';
import { UpdateNoteDto } from './dtos/update-note.dto';
import { NoteDto } from './note.schema';
import { NotesService } from './notes.service';

const routePrefix = 'folders/:folderId/notes/';

@ApiTags('Notes')
@Controller()
@ApiBearerAuth()
@Throttle({
  default: {
    ttl: 60,
    limit: 10,
  },
})
export class NotesController {
  public constructor(private readonly service: NotesService) {}

  @Get('folders/deleted')
  @ApiOperation({
    operationId: 'listSoftDeleted',
    summary: 'Lists a users deleted notes',
    description: 'Lists a users deleted notes.',
  })
  @ApiResponse({ type: Array<NoteDto & DeletedAtDto> })
  @ApiUnauthorizedResponse({ type: IUnauthorizedException })
  public async listSoftDeleted(
    @Request() { user }: AuthenticatedRequest,
  ): Promise<(NoteDto & DeletedAtDto)[]> {
    return await this.service.listSoftDeleted(user.id);
  }

  @Get(routePrefix)
  @ApiOperation({
    operationId: 'list',
    summary: 'Lists a users notes',
    description: 'Lists a users notes.',
  })
  @ApiBody({ type: [NoteDto] })
  @ApiUnauthorizedResponse({ type: IUnauthorizedException })
  public async list(
    @Request() { user }: AuthenticatedRequest,
    @Param() { folderId }: { folderId: string },
  ): Promise<NoteDto[]> {
    return await this.service.list(user.id, folderId);
  }

  @Get(`${routePrefix}:id`)
  @ApiParam({
    type: String,
    name: 'id',
    required: true,
  })
  @ApiOperation({
    operationId: 'get',
    summary: 'Get a users note',
    description: 'Gets a users note by its id.',
  })
  @ApiBody({ type: NoteDto })
  @ApiUnauthorizedResponse({ type: IUnauthorizedException })
  public async get(
    @Request() { user }: AuthenticatedRequest,
    @Param() { folderId, id }: FindOneByIdParam & { folderId: string },
  ): Promise<NoteDto> {
    return await this.service.get(user.id, folderId, id);
  }

  @Post(routePrefix)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    operationId: 'create',
    summary: 'Creates a note',
    description: 'Creates a new note.',
  })
  @ApiBody({ type: CreateNoteDto })
  @ApiCreatedResponse({ type: NoteDto })
  @ApiUnauthorizedResponse({ type: IUnauthorizedException })
  public async create(
    @Request() { user }: AuthenticatedRequest,
    @Param() { folderId }: { folderId: string },
    @Body() createNoteDto: CreateNoteDto,
  ): Promise<NoteDto> {
    return await this.service.create(user.id, folderId, createNoteDto);
  }

  @Patch(`${routePrefix}:id`)
  @ApiOperation({
    operationId: 'update',
    summary: 'Updates a note',
    description: 'Patch updates a note by its id.',
  })
  @ApiBody({ type: NoteDto })
  @ApiCreatedResponse({ type: UpdateNoteDto })
  @ApiUnauthorizedResponse({ type: IUnauthorizedException })
  public async update(
    @Request() { user }: AuthenticatedRequest,
    @Param() { folderId, id }: FindOneByIdParam & { folderId: string },
    @Body() updateNoteDto: UpdateNoteDto,
  ): Promise<UpdateNoteDto> {
    return await this.service.update(user.id, folderId, id, updateNoteDto);
  }

  @Delete(`${routePrefix}:id/soft`)
  @ApiParam({
    type: String,
    name: 'id',
    required: true,
  })
  @ApiOperation({
    operationId: 'softDelete',
    summary: 'Soft delete a note',
    description: 'Soft deletes a note by its id.',
  })
  @ApiResponse({ type: DeletedAtDto })
  @ApiUnauthorizedResponse({ type: IUnauthorizedException })
  public async softDelete(
    @Request() { user }: AuthenticatedRequest,
    @Param() { folderId, id }: FindOneByIdParam & { folderId: string },
  ): Promise<DeletedAtDto> {
    return await this.service.softDelete(user.id, folderId, id);
  }

  @Delete(`${routePrefix}:id`)
  @ApiParam({
    type: String,
    name: 'id',
    required: true,
  })
  @ApiOperation({
    operationId: 'delete',
    summary: 'Delete a note',
    description: 'Deletes a note by its id.',
  })
  @ApiResponse({ type: DeletedAtDto })
  @ApiUnauthorizedResponse({ type: IUnauthorizedException })
  public async delete(
    @Request() { user }: AuthenticatedRequest,
    @Param() { folderId, id }: FindOneByIdParam & { folderId: string },
  ): Promise<DeletedAtDto> {
    await this.service.delete(user.id, folderId, id);
    return { deletedAt: new Date() };
  }
}
