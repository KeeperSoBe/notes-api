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
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { IUnauthorizedException } from '../../shared/interfaces/swagger.interface';
import {
  AuthenticatedRequest,
  FindOneByIdParam,
} from '../../shared/interfaces/request.interface';
import { FoldersService } from './folders.service';
import { FolderDto } from './folder.schema';
import { UpsertFolderDto } from './dtos/upsert-folder.dto';

@ApiTags('Folders')
@Controller('folders')
@ApiBearerAuth()
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
  @ApiUnauthorizedResponse({ type: IUnauthorizedException })
  public async list(
    @Request() { user }: AuthenticatedRequest,
  ): Promise<FolderDto[]> {
    return await this.service.list(user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    operationId: 'create',
    summary: 'Creates a folder',
    description: 'Creates a new folder.',
  })
  @ApiBody({ type: FolderDto })
  @ApiCreatedResponse({ type: FolderDto })
  @ApiUnauthorizedResponse({ type: IUnauthorizedException })
  public async create(
    @Request() { user }: AuthenticatedRequest,
    @Body() upsertFolderDto: UpsertFolderDto,
  ): Promise<FolderDto> {
    return await this.service.create(user.id, upsertFolderDto);
  }

  @Patch(':id')
  @ApiOperation({
    operationId: 'update',
    summary: 'Updates a folder',
    description: 'Patch updates a folder by its id.',
  })
  @ApiBody({ type: FolderDto })
  @ApiCreatedResponse({ type: FolderDto })
  @ApiUnauthorizedResponse({ type: IUnauthorizedException })
  public async update(
    @Request() { user }: AuthenticatedRequest,
    @Param() { id }: FindOneByIdParam,
    @Body() upsertFolderDto: UpsertFolderDto,
  ): Promise<void> {
    await this.service.update(user.id, id, upsertFolderDto);
  }

  @Delete(':id')
  @ApiParam({
    type: String,
    name: 'id',
    required: true,
  })
  @ApiOperation({
    operationId: 'delete',
    summary: 'Delete a folder',
    description: 'Deletes a folder by its id.',
  })
  @ApiUnauthorizedResponse({ type: IUnauthorizedException })
  public async delete(
    @Request() { user }: AuthenticatedRequest,
    @Param() { id }: FindOneByIdParam,
  ): Promise<void> {
    await this.service.delete(user.id, id);
  }
}
