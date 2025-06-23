import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/db/entities/User';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login-dto';
import { HashService } from 'src/common/adapters/bcrypt.adapter';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user-dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @Inject('Hasher') private readonly hasher: HashService,
        private readonly jwtService: JwtService
    ) { }

    private generateToken(payload: any) {
        return this.jwtService.sign(payload, { expiresIn: '1h', secret: process.env.JWT_SECRET_KEY })
    }

    async login(data: LoginDto) {
        const user = await this.userRepository.findOneBy({ email: data.email })

        if (!user) throw new BadRequestException(`Usuário e/ou senha incorretos!`)

        const matchPassword = this.hasher.compare(data.password, user.password)

        if (!matchPassword) throw new BadRequestException(`Usuário e/ou senha incorretos!`)

        const payload = {
            id: user.id,
            role: user.role,
            email: user.email,
            name: user.name
        }

        await this.userRepository.update({ id: user.id! }, { last_login: new Date() })
        const accessToken = this.generateToken(payload)
        return { accessToken }
    }

    async register(data: CreateUserDto) {
        const existsUser = await this.userRepository.findOneBy({ email: data.email })

        if (existsUser) throw new BadRequestException('Usuário já cadastrado')

        const createdUser = await this.userRepository.save({ ...data, password: await this.hasher.hash(data.password) })

        const payload = {
            id: createdUser.id,
            role: createdUser.role,
            email: createdUser.email,
            name: createdUser.name
        }

        const accessToken = this.generateToken(payload)

        return { createdUser, accessToken }
    }
}
