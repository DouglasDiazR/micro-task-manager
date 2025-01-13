import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'

export class RegisterUserDto {
    @ApiProperty({
        description: 'Nombre de usuario, entre 2 y 50 caracteres',
        example: 'User',
    })
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name: string

    @ApiProperty({
        description:
            'Correo electrónico del usuario. Debe ser un correo válido',
        example: 'user@email.com',
    })
    @IsEmail()
    @IsString()
    email: string

    @ApiProperty({
        description:
            'Constraseña del usuario. Debe contener entre 6 y 50 caracteres',
        example: 'contraseña123',
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    password: string
}
