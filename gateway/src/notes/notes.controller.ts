import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { AuthGuard } from 'src/auth/auth.guard'
import { NATS_SERVICE } from 'src/config'
import { CreateNoteDto } from './dto/create-note.dto'
import { User } from 'src/common/decorators/user.decorator'
import { User as IUser } from 'src/auth/entities/auth.entity'
import { catchError } from 'rxjs'
import { UpdateNoteDto } from './dto/update-note.dto'
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger'

@ApiTags('Notes')
@ApiBearerAuth()
@Controller('notes')
export class NotesController {
    constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

    @ApiOperation({
        summary: 'Ruta para crear notas.',
    })
    @UseGuards(AuthGuard)
    @Post()
    create(@Body() createNoteDto: CreateNoteDto, @User() user: IUser) {
        return this.client
            .send('notes.create', {
                ...createNoteDto,
                authorId: user.id,
            })
            .pipe(
                catchError((error) => {
                    throw new RpcException(error)
                }),
            )
    }

    @ApiOperation({
        summary: 'Ruta para buscar todas las notas asosiadas al usuario.',
    })
    @ApiQuery({
        name: 'userId',
        required: false,
        description: 'Filtrar las notas por el Id del usuario asignado',
        example: '6ed467df-ef02-4e24-a539-a201cd1f4c7d',
    })
    @ApiQuery({
        name: 'status',
        required: false,
        description: `Filtrar las notas por su estado (pendiente, progreso o cancelada)`,
        example: 'cancelada',
    })
    @ApiQuery({
        name: 'available',
        required: false,
        description: `Filtrar las notas por su disponibilidad (true o false)`,
        example: false,
    })
    @UseGuards(AuthGuard)
    @Get()
    findAll(
        @User() user: IUser,
        @Query('userId') userId: string,
        @Query('status') status: string,
        @Query('available') available: string,
    ) {
        let isAvailable: boolean | undefined

        if (available === 'true') {
            isAvailable = true
        } else if (available === 'false') {
            isAvailable = false
        }
        return this.client
            .send('notes.findAll', {
                authorId: user.id,
                userId,
                status,
                available: isAvailable,
            })
            .pipe(
                catchError((error) => {
                    throw new RpcException(error)
                }),
            )
    }

    @UseGuards(AuthGuard)
    @Get('id')
    @ApiOperation({
        summary: 'Ruta para buscar una nota específica por su Id.',
    })
    @ApiQuery({
        name: 'id',
        required: true,
        description: 'El ID único de la nota que se desea buscar',
        example: '678583d9f0a63428b8a4e3f1',
    })
    findOne(@User() user: IUser, @Query('id') id: string) {
        return this.client
            .send('notes.findOne', { authorId: user.id, id })
            .pipe(
                catchError((error) => {
                    throw new RpcException(error)
                }),
            )
    }
    @ApiOperation({
        summary: 'Ruta para actualizar una nota asociada al usuario',
    })
    @UseGuards(AuthGuard)
    @Put()
    updateNote(@User() user: IUser, @Body() updateNoteDto: UpdateNoteDto) {
        const payload = { ...updateNoteDto, authorId: user.id }

        return this.client.send('notes.update', payload).pipe(
            catchError((error) => {
                throw new RpcException(error)
            }),
        )
    }

    @ApiOperation({
        summary: 'Ruta para eliminar una nota específica por su Id.',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'Id de la nota a eliminar.',
        example: '678583d9f0a63428b8a4e3f1',
        required: true,
    })
    @UseGuards(AuthGuard)
    @Delete(':id')
    deleteNote(@User() user: IUser, @Param('id') id: string) {
        console.log('id', id)
        return this.client.send('notes.delete', { authorId: user.id, id }).pipe(
            catchError((error) => {
                throw new RpcException(error)
            }),
        )
    }
}
