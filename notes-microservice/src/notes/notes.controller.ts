import { Controller, Query } from '@nestjs/common'
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices'
import { NotesService } from './notes.service'
import { CreateNoteDto, NoteStatus } from './dto/create-note.dto'
import { UpdateNoteDto } from './dto/update-note.dto'

@Controller()
export class NotesController {
    constructor(private readonly notesService: NotesService) {}

    @MessagePattern('notes.create')
    async create(@Payload() createNoteDto: CreateNoteDto) {
        if (!createNoteDto.userId || createNoteDto.userId === '') {
            createNoteDto.userId = createNoteDto.authorId
        }
        const findedUser = await this.notesService.findUser(
            createNoteDto.userId,
        )
        if (!findedUser) {
            throw new RpcException({
                status: 400,
                message: `El usuario con ID ${createNoteDto.userId} no está registrado.`,
            })
        }
        if (!createNoteDto.status) {
            createNoteDto.status = NoteStatus.PENDING
        }
        return this.notesService.create(createNoteDto)
    }

    @MessagePattern('notes.findAll')
    findAll(
        @Payload()
        {
            authorId,
            userId,
            status,
            available,
        }: {
            authorId: string
            userId?: string
            status?: string
            available?: boolean
        },
    ) {
        return this.notesService.findAll(authorId, userId, status, available)
    }

    @MessagePattern('notes.findOne')
    async findOne(
        @Payload() { authorId, id }: { authorId: string; id: string },
    ) {
        const note = await this.notesService.findOne(id)

        if (!note) {
            throw new RpcException('Nota no encontrada')
        }
        if (note.authorId !== authorId) {
            throw new RpcException('No tiene permisos para acceder a esta nota')
        }
        return note
    }

    @MessagePattern('notes.update')
    async update(@Payload() updateNoteDto: UpdateNoteDto) {
        const { id, authorId, userId, ...data } = updateNoteDto

        if (!id) {
            throw new RpcException('El ID de la nota es requerido')
        }
        const note = await this.notesService.findOne(id)
        if (!note) {
            throw new RpcException('Tarea no encontrada')
        }
        if (note.authorId !== authorId) {
            throw new RpcException('No tiene permisos para actualizar la nota')
        }

        if (userId) {
            const findedUser = await this.notesService.findUser(userId)
            if (!findedUser) {
                throw new RpcException({
                    status: 400,
                    message: `El usuario con ID ${userId} no está registrado.`,
                })
            }
            ;(data as Partial<UpdateNoteDto>).userId = userId
        }
        return this.notesService.update(id, data)
    }

    @MessagePattern('notes.delete')
    async delete(
        @Payload() { authorId, id }: { authorId: string; id: string },
    ) {
        const note = await this.notesService.findOne(id)
        if (!note) {
            throw new RpcException('Nota no encontrada')
        }
        if (authorId !== note.authorId) {
            throw new RpcException('No tiene permisos para eliminar esta nota')
        }
        return this.notesService.delete(id)
    }
}
