import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger, ValidationPipe } from '@nestjs/common'
import { environmentVariables } from './config'
import { GlobalRcpExceptionFilter } from './common/exceptions/rpc-exception.filter'

async function bootstrap() {
    const logger = new Logger('Gateway')
    const app = await NestFactory.create(AppModule)
    app.setGlobalPrefix('api')
    app.useGlobalFilters(new GlobalRcpExceptionFilter())
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    )
    await app.listen(environmentVariables.port)
    logger.log(`Gateway is running on port ${environmentVariables.port}`)
}
bootstrap()
