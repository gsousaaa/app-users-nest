import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/db/entities/User';
import { LessThanOrEqual, Repository } from 'typeorm';
import { FindUsersDto } from './dto/find-users-dto';
import { UserTokenPayload } from 'src/common/middlewares/AuthMiddleware';
import { UpdateUserDto } from './dto/update-user-dto';
import { HashService } from 'src/common/adapters/bcrypt.adapter';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
        @Inject('Hasher') private readonly hasher: HashService
    ) { }

    async findAll(filters: FindUsersDto) {
        const { role, sortBy = 'created_at', order = 'ASC' } = filters

        const query = this.usersRepository.createQueryBuilder('users')

        if (role) query.andWhere('users.role = :role', { role })

        query.orderBy(`users.${sortBy}`, order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC')

        const users = await query.getMany()
        return users.map(({ password, ...rest }) => rest)
    }

    async delete(id: number, loggedUserId: number) {
        if (id === loggedUserId) throw new BadRequestException(`Não é possível deletar este usuário`)

        const existsUser = await this.usersRepository.findOneBy({ id })
        if (!existsUser) throw new NotFoundException(`Usuário não encontrado`)

        await this.usersRepository.delete({ id })

        return { message: 'Usuário deletado com sucesso!' }
    }

    async update(id: number, loggedUser: UserTokenPayload, data: UpdateUserDto) {
        const user = await this.usersRepository.findOneBy({ id })
        if (!user) throw new NotFoundException(`Usuário não encontrado`)

        if (data.email) {
            const existsUser = await this.usersRepository.findOneBy({ email: data.email })
            if (existsUser && existsUser.id !== user.id) throw new BadRequestException(`Já existe um usuário cadastrado com esse e-mail`)
        }

        if (loggedUser.role === 'user' && id !== loggedUser.id) {
            throw new BadRequestException('Não é possível alterar os dados de outro usuário');
        }

        if (loggedUser.role === 'user' && data.role) {
            throw new BadRequestException('Usuários comuns não podem alterar o cargo');
        }

        Object.assign(user, { ...data, updatedAt: new Date() })

        return this.usersRepository.save(user)
    }

    async resetPassword(password: string, user: UserTokenPayload) {
        const hashedPassword = await this.hasher.hash(password)
        await this.usersRepository.update({ id: user.id }, { password: hashedPassword })

        return { message: 'Senha alterada com sucesso!' }
    }

    async findInactiveUsers() {
        const thirtyDaysAgo = new Date()

        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const users = await this.usersRepository.findBy({ last_login: LessThanOrEqual(thirtyDaysAgo) })

        return users
    }
}
