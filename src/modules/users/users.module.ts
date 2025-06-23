import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/db/entities/User';
import { BcryptAdapter } from 'src/common/adapters/bcrypt.adapter';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, { provide: 'Hasher', useClass: BcryptAdapter }],
  controllers: [UsersController]
})
export class UsersModule { }
