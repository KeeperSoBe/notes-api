import { ApiProperty } from '@nestjs/swagger';

import { NoteDto } from '../note.schema';

export class SoftDeletedNoteDto extends NoteDto {
  @ApiProperty({
    type: Date,
    example: 'Sat Jan 27 2024 12:00:00 GMT+0000 (Greenwich Mean Time)',
    description: 'The date timestamp the entity was soft deleted.',
  })
  readonly deletedAt: Date;
}
