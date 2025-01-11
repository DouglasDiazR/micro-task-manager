import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger, ValidationPipe } from '@nestjs/common'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { environmentVariables } from './config'

async function bootstrap() {
    const logger = new Logger('Notes-Microservice')

    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.NATS,
            options: {
                servers: environmentVariables.natsServer,
            },
        },
    )
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    )
    await app.listen()
    logger.log(
        `Notes-microservice is running on port ${environmentVariables.natsServer}`,
    )
}
bootstrap()
