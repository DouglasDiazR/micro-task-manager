import { PartialType } from '@nestjs/mapped-types'
import { CreateNoteDto } from './create-note.dto'
import {
    IsBoolean,
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsString,
    MaxLength,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { NoteStatus } from './create-note.dto'
import { Type } from 'class-transformer'

export class UpdateNoteDto extends PartialType(CreateNoteDto) {
    @ApiProperty({
        description: `Id de la nota a actualizar.
        No puede estar vacío.
        El Id debe ser de una nota relacionada al usuario`,
        example: `678583d9f0a63428b8a4e3f1`,
        type: 'string',
    })
    @IsString()
    id: string

    @ApiPropertyOptional({
        description: `Titulo para la nota.
                 Máximo 58 caracteres.`,
        example: 'Nota 1',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(58)
    title?: string

    @ApiPropertyOptional({
        description: `Descripción de la nota. Máximo 58 caracteres.`,
        example: 'Ésta es una descripción de la nota 1',
        type: 'string',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(58)
    description?: string

    @ApiPropertyOptional({
        description: `Id del usuario al que se le va a asignar la nota. 
            Es opcional.  
            El Id asignado debe ser de un usuario registrado en la app`,
        example: '6ed467df-ef02-4e24-a539-a201cd1f4c7d',
        type: 'string',
    })
    @IsString()
    userId?: string

    @ApiPropertyOptional({
        enum: ['pendiente', 'progreso', 'cancelada'],
        description: `Es opcional.
            Solo puede asiganar uno de éstos 3 estados: (pendiente, progreso o  cancelada)`,
        example: 'en progreso',
        type: 'string',
    })
    @IsEnum(NoteStatus, {
        message: 'El estado debe ser pendiente, en progreso o cancelada',
    })
    status?: NoteStatus = NoteStatus.PENDING

    @ApiPropertyOptional({
        description: `Disponibilidad de la nota (true o false).
            Es opcional.`,
        example: 'true',
        type: 'boolean',
    })
    @IsBoolean()
    available?: boolean

    @ApiPropertyOptional({
        description: `Fecha límite para la nota.
            Formato : MM-DD-AAAA 
            Es opcional.`,
        example: '02-15-2025',
    })
    @IsDate()
    @Type(() => Date)
    endDate?: Date
}
