import { Injectable, OnModuleInit } from '@nestjs/common'
import { RegisterUserDto } from './dto/registerUser.dto'
import { LoginUserDto } from './dto/loginUser.dto'
import { JwtService } from '@nestjs/jwt'
import { IJwtPayload } from './interfaces/jwt-payload.interface'
import { environmentVariables } from 'src/config'
import { RpcException } from '@nestjs/microservices'
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'
@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
    constructor(private readonly jwtService: JwtService) {
        super()
    }

    async onModuleInit() {
        try {
            await this.$connect()
        } catch (error) {
            throw new RpcException({
                status: 500,
                message: 'Error al conectar con la base de datos',
                details: error.message,
            })
        }
    }
    async register(registerUserDto: RegisterUserDto) {
        try {
            const exist = await this.user.findUnique({
                where: {
                    email: registerUserDto.email,
                },
            })
            if (exist) {
                throw new RpcException({
                    status: 400,
                    message: `El correo ${registerUserDto.email} ya está registrado`,
                })
            }
            const hasehdPassword = bcrypt.hashSync(registerUserDto.password, 10)

            const newUser = await this.user.create({
                data: {
                    ...registerUserDto,
                    password: hasehdPassword,
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    createdAt: true,
                    updatedAt: true,
                },
            })
            return newUser
        } catch (error) {
            throw new RpcException({
                status: 500,
                message: 'Error al registrar el usuario',
                details: error.message || 'Error desconocido',
            })
        }
    }

    async login(loginUserDto: LoginUserDto) {
        try {
            const exist = await this.user.findUnique({
                where: {
                    email: loginUserDto.email,
                },
            })
            if (!exist) {
                throw new RpcException({
                    status: 400,
                    message: `El correo ${loginUserDto.email} no se encuentra registrado`,
                })
            }
            const isPasswordCorrect = bcrypt.compareSync(
                loginUserDto.password,
                exist.password,
            )
            if (!isPasswordCorrect) {
                throw new RpcException({
                    status: 401,
                    message: `Contraseña incorrecta`,
                })
            }
            const {
                password: _,
                createdAt: __,
                updatedAt: ___,
                ...rest
            } = exist
            return {
                user: rest,
                token: this.signJwt(rest),
            }
        } catch (error) {
            throw new RpcException({
                status: 500,
                message: 'Error al iniciar sesión',
                details: error.message || 'Error desconocido',
            })
        }
    }

    async verify(token: string) {
        try {
            const {
                sub: _,
                iat: __,
                exp: ___,
                ...user
            } = this.jwtService.verify(token, {
                secret: environmentVariables.jwtSecret,
            })

            return {
                user: user,
                token: this.signJwt(user),
            }
        } catch (error) {
            throw new RpcException({
                status: 400,
                message: `Token inválido: ${error.message}`,
            })
        }
    }

    signJwt(payload: IJwtPayload) {
        return this.jwtService.sign(payload)
    }

    async findUser(userId: string) {
        try {
            return await this.user.findUnique({
                where: { id: userId },
            })
        } catch (error) {
            throw new RpcException({
                status: 500,
                message: 'Error al buscar el usuario',
                details: error.message || 'Error desconocido',
            })
        }
    }
}
