import { Injectable, OnModuleInit, Inject } from '@nestjs/common'
import { CreateNoteDto } from './dto/create-note.dto'
import { UpdateNoteDto } from './dto/update-note.dto'
import { PrismaClient } from '@prisma/client'
import { RpcException, ClientProxy } from '@nestjs/microservices'
import { NATS_SERVICE } from 'src/config'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class NotesService extends PrismaClient implements OnModuleInit {
    constructor(
        @Inject(NATS_SERVICE) private readonly authService: ClientProxy,
    ) {
        super()
    }
    async onModuleInit() {
        try {
            await this.$connect()
        } catch (error) {
            console.error('Error al conectar con la base de datos:', error)
            throw new RpcException({
                status: 500,
                message: 'Error al conectar con la base de datos',
            })
        }
    }
    async create(createNoteDto: CreateNoteDto) {
        try {
            return await this.note.create({
                data: createNoteDto,
            })
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message || 'Error al crear la nota',
            })
        }
    }

    async findAll(
        authorId: string,
        userId?: string,
        status?: string,
        available?: boolean,
    ) {
        const filters: any = { authorId }

        if (userId) {
            filters.userId = userId
        }
        if (status) {
            filters.status = status
        }
        if (available != undefined) {
            filters.available = available
        }
        try {
            return await this.note.findMany({
                where: filters,
            })
        } catch (error) {
            throw new RpcException({
                status: 500,
                message: 'Error al obtener las notas',
            })
        }
    }

    async findOne(id: string) {
        try {
            return await this.note.findUnique({
                where: { id },
            })
        } catch (error) {
            throw new RpcException({
                status: 500,
                message: 'Error al obtener la nota',
            })
        }
    }

    async update(id: string, updateNoteDto: UpdateNoteDto) {
        try {
            return await this.note.update({
                where: { id: id },
                data: updateNoteDto,
            })
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message || 'Error al actualizar la nota',
            })
        }
    }

    async delete(id: string) {
        try {
            return await this.note.delete({
                where: { id: id },
            })
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: error.message || 'Error al eliminar la nota',
            })
        }
    }

    async findUser(userId: string): Promise<boolean> {
        try {
            const findedUser = await firstValueFrom(
                this.authService.send('users.findById', userId),
            )
            return !!findedUser
        } catch (error) {
            console.error('Error al validar el usuario:', error)
            return false
        }
    }
}
