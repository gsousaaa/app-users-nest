import { IsStrongPassword } from "class-validator";

export class ResetPasswordDto {
    @IsStrongPassword({}, { message: 'Senha fraca: mínimo de 8 caracteres com letras, números e símbolos' })
    password: string
}