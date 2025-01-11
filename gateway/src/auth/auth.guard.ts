import {
    CanActivate,
    ExecutionContext,
    Inject,
    UnauthorizedException,
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

import { Request } from 'express'
import { firstValueFrom } from 'rxjs'
import { NATS_SERVICE } from 'src/config'

export class AuthGuard implements CanActivate {
    constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest()
        const token = this.tokenExtractor(request)

        if (!token) {
            throw new UnauthorizedException('Token no encontrado')
        }

        try {
            const { user, token: newToken } = await firstValueFrom(
                this.client.send('verify.token', token),
            )
            request.user = user
            request.token = newToken
            return true
        } catch (error) {
            console.log(error)
            throw new UnauthorizedException()
        }
    }

    tokenExtractor(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? []
        return type == 'Bearer' ? token : undefined
    }
}
