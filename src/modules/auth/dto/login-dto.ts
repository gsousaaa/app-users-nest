import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class LoginDto {
    @IsEmail({}, { message: 'E-mail inválido' })
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    password: string
}