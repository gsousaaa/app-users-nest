import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsStrongPassword()
    password: string

    @IsNotEmpty()
    name: string
}