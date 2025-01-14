import { DocumentBuilder } from '@nestjs/swagger'

export const swaggerConfig = new DocumentBuilder()
    .setTitle('micro-task-manager')
    .setDescription(
        'Sistema de gestión de tareas llamado "MicroTask Manager" utilizando NestJS y adoptando una arquitectura de microservicios',
    )
    .addBearerAuth()
    .setVersion('1.0')
    .build()
