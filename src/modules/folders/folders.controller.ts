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
import { CreateFolderDto } from './dtos/create-folder.dto';
import { UpdateFolderDto } from './dtos/update-folder.dto';
import { FolderDto } from './folder.schema';
import { FoldersService } from './folders.service';

@ApiTags('Folders')
@Controller('folders')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ type: IUnauthorizedException })
@ApiInternalServerErrorResponse({ type: IInternalServerErrorException })
@Throttle({
  default: {
    ttl: 60,
    limit: 10,
  },
})
export class FoldersController {
  public constructor(private readonly service: FoldersService) {}

  @Get()
  @ApiOperation({
    operationId: 'list',
    summary: 'Lists a users folders',
    description: 'Lists a users folders.',
  })
  @ApiBody({ type: [FolderDto] })
  @ApiOkResponse({ type: [FolderDto] })
  public async list(
    @Request() { user }: AuthenticatedRequest,
  ): Promise<FolderDto[]> {
    return await this.service.list(user.id);
  }

  @Get(':id')
  @ApiParam({
    type: String,
    name: 'id',
    required: true,
    example: '977e537c-fcc2-403f-9838-d9420a1a6801',
    description: 'The id of the folder.',
  })
  @ApiOperation({
    operationId: 'get',
    summary: 'Gets a users folder',
    description: 'Gets a users folder.',
  })
  @ApiBody({ type: FolderDto })
  @ApiOkResponse({ type: FolderDto })
  @ApiNotFoundResponse({ type: INotFoundException })
  public async get(
    @Param() { id }: FindOneByIdParam,
    @Request() { user }: AuthenticatedRequest,
  ): Promise<FolderDto> {
    return await this.service.get(user.id, id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    operationId: 'create',
    summary: 'Creates a folder',
    description: 'Creates a new folder.',
  })
  @ApiBody({ type: CreateFolderDto })
  @ApiCreatedResponse({ type: FolderDto })
  @ApiBadRequestResponse({ type: IBadRequestException })
  public async create(
    @Request() { user }: AuthenticatedRequest,
    @Body() createFolderDto: CreateFolderDto,
  ): Promise<FolderDto> {
    return await this.service.create(user.id, createFolderDto);
  }

  @Patch(':id')
  @ApiParam({
    type: String,
    name: 'id',
    required: true,
    example: '977e537c-fcc2-403f-9838-d9420a1a6801',
    description: 'The id of the folder.',
  })
  @ApiOperation({
    operationId: 'update',
    summary: 'Updates a folder',
    description: 'Patch updates a folder by its id.',
  })
  @ApiBody({ type: UpdateFolderDto })
  @ApiOkResponse({ type: UpdateFolderDto })
  @ApiBadRequestResponse({ type: IBadRequestException })
  @ApiNotFoundResponse({ type: INotFoundException })
  public async update(
    @Request() { user }: AuthenticatedRequest,
    @Param() { id }: FindOneByIdParam,
    @Body() updateFolderDto: UpdateFolderDto,
  ): Promise<UpdateFolderDto> {
    return await this.service.update(user.id, id, updateFolderDto);
  }

  @Delete(':id')
  @ApiParam({
    type: String,
    name: 'id',
    required: true,
    example: '977e537c-fcc2-403f-9838-d9420a1a6801',
    description: 'The id of the folder.',
  })
  @ApiOperation({
    operationId: 'delete',
    summary: 'Delete a folder',
    description: 'Deletes a folder by its id.',
  })
  @ApiOkResponse({ type: DeletedAtDto })
  @ApiNotFoundResponse({ type: INotFoundException })
  public async delete(
    @Request() { user }: AuthenticatedRequest,
    @Param() { id }: FindOneByIdParam,
  ): Promise<DeletedAtDto> {
    await this.service.delete(user.id, id);
    return { deletedAt: new Date() };
  }
}
