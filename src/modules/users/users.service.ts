import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/db/entities/User';
import { Repository } from 'typeorm';
import { FindUsersDto } from './dto/find-users-dto';

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
        if (!existsUser) throw new BadRequestException(`Usuário não existe`)

        await this.usersRepository.delete({ id })

        return { message: 'Usuário deletado com sucesso!' }
    }
}
