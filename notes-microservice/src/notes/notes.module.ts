import { Module } from '@nestjs/common'
import { NotesService } from './notes.service'
import { NotesController } from './notes.controller'
import { NatsModule } from 'src/transports/nats.module'

@Module({
    imports: [NatsModule],
    controllers: [NotesController],
    providers: [NotesService],
})
export class NotesModule {}
