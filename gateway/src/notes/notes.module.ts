import { Module } from '@nestjs/common'
import { NotesController } from './notes.controller'
import { NatsModule } from 'src/transports/nats.module'

@Module({
    controllers: [NotesController],
    providers: [],
    imports: [NatsModule],
})
export class NotesModule {}
