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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { DeletedAtDto } from '../../shared/dtos/deleted-at.dto';
import {
  AuthenticatedRequest,
  FindOneByIdParam,
} from '../../shared/interfaces/request.interface';
import {
  IBadRequestException,
  IInternalServerErrorException,
  INotFoundException,
  IUnauthorizedException,
} from '../../shared/interfaces/swagger.interface';
import { CreateNoteDto } from './dtos/create-note.dto';
import { UpdateNoteDto } from './dtos/update-note.dto';
import { NoteDto } from './note.schema';
import { NotesService } from './notes.service';

const routePrefix = 'folders/:folderId/notes/';

@ApiTags('Notes')
@Controller()
@ApiBearerAuth()
@ApiUnauthorizedResponse({ type: IUnauthorizedException })
@ApiInternalServerErrorResponse({ type: IInternalServerErrorException })
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
  @ApiOkResponse({ type: [NoteDto] })
  public async listSoftDeleted(
    @Request() { user }: AuthenticatedRequest,
  ): Promise<(NoteDto & DeletedAtDto)[]> {
    return await this.service.listSoftDeleted(user.id);
  }

  @Get(routePrefix)
  @ApiParam({
    type: String,
    name: 'folderId',
    required: true,
    example: '977e537c-fcc2-403f-9838-d9420a1a6801',
    description: 'The id of the folder.',
  })
  @ApiOperation({
    operationId: 'list',
    summary: 'Lists a users notes',
    description: 'Lists a users notes.',
  })
  @ApiOkResponse({ type: [NoteDto] })
  public async list(
    @Request() { user }: AuthenticatedRequest,
    @Param() { folderId }: { folderId: string },
  ): Promise<NoteDto[]> {
    return await this.service.list(user.id, folderId);
  }

  @Get(`${routePrefix}:id`)
  @ApiParam({
    type: String,
    name: 'folderId',
    required: true,
    example: '977e537c-fcc2-403f-9838-d9420a1a6801',
    description: 'The id of the folder.',
  })
  @ApiParam({
    type: String,
    name: 'id',
    required: true,
    example: '977e537c-fcc2-403f-9838-d9420a1a6801',
    description: 'The id of the note.',
  })
  @ApiOperation({
    operationId: 'get',
    summary: 'Get a users note',
    description: 'Gets a users note by its id.',
  })
  @ApiOkResponse({ type: NoteDto })
  @ApiNotFoundResponse({ type: INotFoundException })
  public async get(
    @Request() { user }: AuthenticatedRequest,
    @Param() { folderId, id }: FindOneByIdParam & { folderId: string },
  ): Promise<NoteDto> {
    return await this.service.get(user.id, folderId, id);
  }

  @Post(routePrefix)
  @ApiParam({
    type: String,
    name: 'folderId',
    required: true,
    example: '977e537c-fcc2-403f-9838-d9420a1a6801',
    description: 'The id of the folder.',
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    operationId: 'create',
    summary: 'Creates a note',
    description: 'Creates a new note.',
  })
  @ApiBody({ type: CreateNoteDto })
  @ApiCreatedResponse({ type: NoteDto })
  public async create(
    @Request() { user }: AuthenticatedRequest,
    @Param() { folderId }: { folderId: string },
    @Body() createNoteDto: CreateNoteDto,
  ): Promise<NoteDto> {
    return await this.service.create(user.id, folderId, createNoteDto);
  }

  @Patch(`${routePrefix}:id`)
  @ApiParam({
    type: String,
    name: 'folderId',
    required: true,
    example: '977e537c-fcc2-403f-9838-d9420a1a6801',
    description: 'The id of the folder.',
  })
  @ApiParam({
    type: String,
    name: 'id',
    required: true,
    example: '977e537c-fcc2-403f-9838-d9420a1a6801',
    description: 'The id of the note.',
  })
  @ApiOperation({
    operationId: 'update',
    summary: 'Updates a note',
    description: 'Patch updates a note by its id.',
  })
  @ApiBody({ type: UpdateNoteDto })
  @ApiOkResponse({ type: UpdateNoteDto })
  @ApiBadRequestResponse({ type: IBadRequestException })
  @ApiNotFoundResponse({ type: INotFoundException })
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
    name: 'folderId',
    required: true,
    example: '977e537c-fcc2-403f-9838-d9420a1a6801',
    description: 'The id of the folder.',
  })
  @ApiParam({
    type: String,
    name: 'id',
    required: true,
    example: '977e537c-fcc2-403f-9838-d9420a1a6801',
    description: 'The id of the note.',
  })
  @ApiOperation({
    operationId: 'softDelete',
    summary: 'Soft delete a note',
    description: 'Soft deletes a note by its id.',
  })
  @ApiOkResponse({ type: DeletedAtDto })
  @ApiNotFoundResponse({ type: DeletedAtDto })
  public async softDelete(
    @Request() { user }: AuthenticatedRequest,
    @Param() { folderId, id }: FindOneByIdParam & { folderId: string },
  ): Promise<DeletedAtDto> {
    return await this.service.softDelete(user.id, folderId, id);
  }

  @Delete(`${routePrefix}:id`)
  @ApiParam({
    type: String,
    name: 'folderId',
    required: true,
    example: '977e537c-fcc2-403f-9838-d9420a1a6801',
    description: 'The id of the folder.',
  })
  @ApiParam({
    type: String,
    name: 'id',
    required: true,
    example: '977e537c-fcc2-403f-9838-d9420a1a6801',
    description: 'The id of the note.',
  })
  @ApiOperation({
    operationId: 'delete',
    summary: 'Delete a note',
    description: 'Deletes a note by its id.',
  })
  @ApiOkResponse({ type: DeletedAtDto })
  @ApiNotFoundResponse({ type: DeletedAtDto })
  public async delete(
    @Request() { user }: AuthenticatedRequest,
    @Param() { folderId, id }: FindOneByIdParam & { folderId: string },
  ): Promise<DeletedAtDto> {
    await this.service.delete(user.id, folderId, id);
    return { deletedAt: new Date() };
  }
}
