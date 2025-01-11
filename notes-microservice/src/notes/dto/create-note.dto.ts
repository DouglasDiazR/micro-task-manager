import { Type } from 'class-transformer'
import {
    IsBoolean,
    IsDate,
    IsEnum,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator'

export enum NoteStatus {
    PENDING = 'pendiente',
    PROGRESS = 'progreso',
    CANCELLED = 'cancelada',
}

export class CreateNoteDto {
    @IsString()
    @MaxLength(55)
    title: string

    @IsString()
    description: string

    @IsString()
    authorId: string

    @IsString()
    @IsOptional()
    userId?: string

    @IsOptional()
    @IsEnum(NoteStatus, {
        message: 'El estado debe ser pendiente, en progreso o cancelada',
    })
    status: NoteStatus = NoteStatus.PENDING

    @IsOptional()
    @IsBoolean()
    available?: boolean

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    endDate?: Date
}
