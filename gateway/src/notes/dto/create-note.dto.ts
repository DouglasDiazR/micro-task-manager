import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
    IsBoolean,
    IsDate,
    IsEnum,
    IsNotEmpty,
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
    @ApiProperty({
        description: `Titulo para la nota.
             Máximo 58 caracteres. 
             No puede estar vacío`,
        example: 'Nota 1',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(58)
    title: string

    @ApiProperty({
        description: `Descripción de la nota. Máximo 58 caracteres. 
            No puede estar vacío`,
        example: 'Ésta es una descripción de la nota 1',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(58)
    description: string

    @ApiProperty({
        description: `Id del usuario al que se le va a asignar la nota. 
            Es opcional. 
            Si no se asiga, el valor por defecto es el Id del creador de la nota. 
            El Id asignado debe ser de un usuario registrado en la app`,
        example: '6ed467df-ef02-4e24-a539-a201cd1f4c7d',
    })
    @IsString()
    @IsOptional()
    userId?: string

    @ApiProperty({
        enum: ['pendiente', 'progreso', 'cancelada'],
        description: `Es opcional.
        Su valor por defecto es pendiente.
        Solo puede asiganar uno de éstos 3 estados: (pendiente, progreso o  cancelada)`,
        example: 'en progreso',
    })
    @IsOptional()
    @IsEnum(NoteStatus, {
        message: 'El estado debe ser pendiente, en progreso o cancelada',
    })
    status: NoteStatus = NoteStatus.PENDING

    @ApiProperty({
        description: `Disponibilidad de la nota (true o false).
        Es opcional.
        Su valor por defecto es true.`,
        example: 'true',
        type: 'boolean',
    })
    @IsOptional()
    @IsBoolean()
    available?: boolean

    @ApiProperty({
        description: `Fecha límite para la nota.
        Formato : MM-DD-AAAA 
        Es opcional.`,
        example: '02-15-2025',
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    endDate?: Date
}
