import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Inject,
    HttpCode,
} from '@nestjs/common'
import { RegisterUserDto } from './dto/register.dto'
import { LoginUserDto } from './dto/loginUser.dto'
import { AuthGuard } from './auth.guard'
import { NATS_SERVICE } from 'src/config'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { catchError } from 'rxjs'
import { User } from '../common/decorators/user.decorator'
import { Token } from '../common/decorators/token.decorator'
import { User as IUser } from './entities/auth.entity'
import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

    @Post('register')
    @ApiOperation({
        summary: 'Ruta para registrar un usuario',
    })
    @HttpCode(201)
    register(@Body() registerUserDto: RegisterUserDto) {
        return this.client.send('auth.register', registerUserDto).pipe(
            catchError((error) => {
                throw new RpcException(error)
            }),
        )
    }

    @Post('login')
    @ApiOperation({
        summary: 'Ruta para iniciar sesión con un usuario registrado',
    })
    @HttpCode(200)
    login(@Body() loginUserDto: LoginUserDto) {
        return this.client.send('auth.login', loginUserDto).pipe(
            catchError((error) => {
                throw new RpcException(error)
            }),
        )
    }
    @UseGuards(AuthGuard)
    @Get('verify')
    @ApiExcludeEndpoint()
    verify(@User() user: IUser, @Token() token: string) {
        return { user, token }
    }
}
