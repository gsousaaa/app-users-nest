import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string

  @IsStrongPassword({}, { message: 'Senha fraca: mínimo de 8 caracteres com letras, números e símbolos' })
  password: string

  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string
}