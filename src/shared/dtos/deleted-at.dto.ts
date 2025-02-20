import { ApiProperty } from '@nestjs/swagger';

export class DeletedAtDto {
  @ApiProperty({
    type: Date,
    readOnly: true,
    required: true,
    example: 'Sat Jan 27 2024 12:00:00 GMT+0000 (Greenwich Mean Time)',
    description: 'The date timestamp the entity was deleted.',
  })
  readonly deletedAt: Date;
}
