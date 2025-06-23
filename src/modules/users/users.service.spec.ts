import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository, SelectQueryBuilder, UpdateResult } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { HashService } from '../../common/adapters/bcrypt.adapter';
import { FindUsersDto } from './dto/find-users-dto';
import { UserTokenPayload } from '../../common/middlewares/AuthMiddleware';
import { User } from '../../db/entities/User';
import { RoleEnum } from '../../utils/enums/RoleEnum';
import { SortBy } from '../../utils/enums/SortBy';
import { Order } from '../../utils/enums/Order';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: jest.Mocked<Repository<User>>;
  let hasher: HashService;

  const mockQueryBuilder: Partial<SelectQueryBuilder<User>> = {
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
  };

  const createMockRepository = (): Partial<jest.Mocked<Repository<User>>> => ({
    findOneBy: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    save: jest.fn(),
    findBy: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder as SelectQueryBuilder<User>),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository(),
        },
        {
          provide: 'Hasher',
          useValue: {
            hash: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get(getRepositoryToken(User));
    hasher = module.get('Hasher');
  });

  describe('findInactiveUsers', () => {
    it('should return users with last_login <= 30 days ago', async () => {
      const mockUsers = [{ id: 1, last_login: new Date('2020-01-01') }];
      usersRepository.findBy!.mockResolvedValue(mockUsers as User[]);

      const result = await service.findInactiveUsers();

      expect(usersRepository.findBy).toHaveBeenCalledWith(expect.objectContaining({ last_login: expect.objectContaining({ _type: 'lessThanOrEqual' }) }));
      expect(result).toEqual(mockUsers);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      usersRepository.findOneBy!.mockResolvedValue({ id: 2 } as User);
      usersRepository.delete!.mockResolvedValue({ affected: 1 } as DeleteResult);

      const result = await service.delete(2, 1);

      expect(result).toEqual({ message: 'Usuário deletado com sucesso!' });
    });

    it('should throw if user tries to delete themselves', async () => {
      await expect(service.delete(1, 1)).rejects.toThrow(BadRequestException);
    });

    it('should throw if user not found', async () => {
      usersRepository.findOneBy!.mockResolvedValue(null);
      await expect(service.delete(999, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update user data', async () => {
      const user = { id: 1, email: 'test@example.com' } as User;
      usersRepository.findOneBy!.mockResolvedValueOnce(user);
      usersRepository.findOneBy!.mockResolvedValueOnce(null);
      usersRepository.save!.mockResolvedValue({ ...user, name: 'Updated' });

      const result = await service.update(1, { id: 1, role: RoleEnum.USER } as UserTokenPayload, { name: 'Updated' });

      expect(result.name).toBe('Updated');
    });

    it('should throw if user not found', async () => {
      usersRepository.findOneBy!.mockResolvedValue(null);

      await expect(service.update(99, { id: 1, role: RoleEnum.USER } as UserTokenPayload, {})).rejects.toThrow(NotFoundException);
    });

    it('should prevent changing another user\'s data if role is user', async () => {
      usersRepository.findOneBy!.mockResolvedValue({ id: 2 } as User);

      await expect(
        service.update(2, { id: 1, role: RoleEnum.USER } as UserTokenPayload, { name: 'Test' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should prevent changing role if user is not admin', async () => {
      usersRepository.findOneBy!.mockResolvedValue({ id: 1 } as User);

      await expect(
        service.update(1, { id: 1, role: RoleEnum.USER } as UserTokenPayload, { role: RoleEnum.ADMIN }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if updating to an email already in use by another user', async () => {
      usersRepository.findOneBy!.mockResolvedValueOnce({ id: 1 } as User);
      usersRepository.findOneBy!.mockResolvedValueOnce({ id: 2 } as User);

      await expect(
        service.update(1, { id: 1, role: RoleEnum.ADMIN } as UserTokenPayload, { email: 'conflict@example.com' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('resetPassword', () => {
    it('should hash the password and update it', async () => {
      (hasher.hash as jest.Mock).mockResolvedValue('hashedPassword');
      usersRepository.update!.mockResolvedValue({ affected: 1 } as UpdateResult);

      const result = await service.resetPassword('newPass', { id: 1, role: RoleEnum.USER } as UserTokenPayload);

      expect(hasher.hash).toHaveBeenCalledWith('newPass');
      expect(usersRepository.update).toHaveBeenCalledWith({ id: 1 }, { password: 'hashedPassword' });
      expect(result).toEqual({ message: 'Senha alterada com sucesso!' });
    });
  });

  describe('findAll', () => {
    it('should return users', async () => {
      const getManyMock = jest.fn().mockResolvedValue([
        { id: 1, name: 'User', email: 'a@a.com', password: 'secret' } as User,
      ]);

      const queryBuilderMock = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: getManyMock,
      };

      usersRepository.createQueryBuilder!.mockReturnValue(queryBuilderMock as any);

      const filters: FindUsersDto = {};
      const result = await service.findAll(filters);

      expect(result[0].email).toBe('a@a.com');
    });

    it('should apply role filter and orderBy', async () => {
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      usersRepository.createQueryBuilder!.mockReturnValue(mockQueryBuilder as any);

      const filters: FindUsersDto = {
        role: RoleEnum.ADMIN,
        sortBy: SortBy.CREATED_AT,
        order: Order.DESC,
      };

      await service.findAll(filters);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('users.role = :role', { role: RoleEnum.ADMIN });
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('users.created_at', 'DESC');
    });
  });
});
