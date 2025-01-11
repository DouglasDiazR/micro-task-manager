import { PartialType } from '@nestjs/mapped-types'
import { CreateNoteDto } from './create-note.dto'
import { IsOptional, IsString } from 'class-validator'

export class UpdateNoteDto extends PartialType(CreateNoteDto) {
    @IsString()
    id: string

    @IsOptional()
    @IsString()
    userId?: string
}
