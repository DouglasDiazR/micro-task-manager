import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterUserDto {
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name: string

    @IsEmail()
    @IsString()
    email: string

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    password: string
}
