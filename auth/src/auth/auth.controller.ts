import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { AuthService } from './auth.service'
import { RegisterUserDto } from './dto/registerUser.dto'
import { LoginUserDto } from './dto/loginUser.dto'

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @MessagePattern('auth.register')
    register(@Payload() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto)
    }

    @MessagePattern('auth.login')
    login(@Payload() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto)
    }

    @MessagePattern('verify.token')
    verify(@Payload() token: string) {
        return this.authService.verify(token)
    }

    @MessagePattern('users.findById')
    async findUser(@Payload() userId: string) {
        return await this.authService.findUser(userId)
    }
}
