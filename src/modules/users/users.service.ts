import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/db/entities/User';
import { Repository } from 'typeorm';
import { FindUsersDto } from './dto/find-users-dto';
import { UserTokenPayload } from 'src/common/middlewares/AuthMiddleware';
import { UpdateUserDto } from './dto/update-user-dto';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) { }

    async findAll(filters: FindUsersDto) {
        const { role, sortBy = 'createdAt', order = 'ASC' } = filters

        const query = this.usersRepository.createQueryBuilder('user')

        if (role) query.andWhere('user.role = :role', { role })

        query.orderBy(`user.${sortBy}`, order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC')

        return query.getMany()
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
}
