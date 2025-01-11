import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { options } from 'joi'
import { environmentVariables, NATS_SERVICE } from 'src/config'

@Module({
    imports: [
        ClientsModule.register([
            {
                name: NATS_SERVICE,
                transport: Transport.NATS,
                options: {
                    servers: environmentVariables.natsServer,
                },
            },
        ]),
    ],
    exports: [
        ClientsModule.register([
            {
                name: NATS_SERVICE,
                transport: Transport.NATS,
                options: {
                    servers: environmentVariables.natsServer,
                },
            },
        ]),
    ],
})
export class NatsModule {}
