import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'

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
