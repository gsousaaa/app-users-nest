import { Body, Controller, HttpCode, HttpStatus, Injectable, Post } from '@nestjs/common';
import { LoginDto } from './dto/login-dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user-dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() data: LoginDto) {
        return this.authService.login(data)
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    async register(@Body() data: CreateUserDto) {
        return this.authService.register(data)
    }

}
