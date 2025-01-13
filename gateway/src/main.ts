import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger, ValidationPipe } from '@nestjs/common'
import { environmentVariables } from './config'
import { GlobalRcpExceptionFilter } from './common/exceptions/rpc-exception.filter'
import { SwaggerModule } from '@nestjs/swagger'
import { swaggerConfig } from './config/swagger'

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

    const apiDocumentation = SwaggerModule.createDocument(app, swaggerConfig)
    SwaggerModule.setup('api', app, apiDocumentation)

    await app.listen(environmentVariables.port)
    logger.log(`Gateway is running on port ${environmentVariables.port}`)
    logger.log(
        `Documentación api is running on port http://localhost:${environmentVariables.port}/api`,
    )
}
bootstrap()
