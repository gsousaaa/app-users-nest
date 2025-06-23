import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Repository, UpdateResult } from 'typeorm';
import { User } from 'src/db/entities/User';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/common/adapters/bcrypt.adapter';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoginDto } from './dto/login-dto';
import { BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<Repository<User>>
  let jwtService: jest.Mocked<JwtService>
  let hasher: HashService

  const mockUser = {
    id: 1,
    name: 'User',
    email: 'user@example.com',
    password: 'teste1234',
    role: 'user'
  } as User


  const createMockRepository = (): Partial<jest.Mocked<Repository<User>>> => ({
    findOneBy: jest.fn(),
    update: jest.fn(),
    save: jest.fn()
  })
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository(),
        },
        {
          provide: 'Hasher',
          useValue: {
            compare: jest.fn(),
            hash: jest.fn().mockReturnValue('hashed'),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('fake.jwt.token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
    jwtService = module.get(JwtService);
    hasher = module.get('Hasher');
  });

  describe('login', () => {
    it('should login successfuly', async () => {
      const data: LoginDto = { email: mockUser.email, password: mockUser.password }

      userRepository.findOneBy!.mockResolvedValue(mockUser)
      await (hasher.compare as jest.Mock).mockResolvedValue(true)

      userRepository.update!.mockResolvedValue({ affected: 1 } as UpdateResult)


      const result = await service.login(data)

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email: data.email })
      expect(hasher.hash(data.password)).toEqual('hashed')

      expect(result).toEqual({ accessToken: 'fake.jwt.token' })
    });

    it('should login failed when user is not found', async () => {
      const data: LoginDto = { email: mockUser.email, password: mockUser.password }
      userRepository.findOneBy!.mockResolvedValue(null)

      await expect(service.login(data))
        .rejects.toThrow(BadRequestException);
    })

    it('should login failed when password does not match', async () => {
      const data: LoginDto = { email: mockUser.email, password: mockUser.password }
      userRepository.findOneBy!.mockResolvedValue(mockUser)
      await (hasher.compare as jest.Mock).mockReturnValue(false)

      await expect(service.login(data))
        .rejects.toThrow(BadRequestException);
    })
  })


  describe('register', () => {
    it('should register user and return token', async () => {
      const dto: CreateUserDto = {
        name: 'Test',
        email: 'new@example.com',
        password: 'plain',
      };

      userRepository.findOneBy!.mockResolvedValue(null);
      (hasher.hash as jest.Mock).mockResolvedValue('hashed123');
      userRepository.save!.mockResolvedValue({ ...mockUser, password: 'hashed123' });

      const result = await service.register(dto);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email: dto.email });
      expect(hasher.hash).toHaveBeenCalledWith(dto.password);
      expect(userRepository.save).toHaveBeenCalledWith({ ...dto, password: 'hashed123' });
      expect(result).toEqual({
        createdUser: { ...mockUser, password: 'hashed123' },
        accessToken: 'fake.jwt.token',
      });
    });

    it('should throw if user already exists', async () => {
      userRepository.findOneBy!.mockResolvedValue(mockUser);

      await expect(service.register({
        name: 'Test',
        email: mockUser.email,
        password: '123',
      })).rejects.toThrow(BadRequestException);
    });
  });
});
