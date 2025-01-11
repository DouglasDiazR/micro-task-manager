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

@Controller('notes')
export class NotesController {
    constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

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
    findOne(@User() user: IUser, @Body('id') id: string) {
        return this.client
            .send('notes.findOne', { authorId: user.id, id })
            .pipe(
                catchError((error) => {
                    throw new RpcException(error)
                }),
            )
    }

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
