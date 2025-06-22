import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BcryptAdapter } from 'src/common/adapters/bcrypt.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/db/entities/User';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [TypeOrmModule.forFeature([User]), JwtModule.register({
        secret: process.env.JWT_SECRET_KEY,
        signOptions: { expiresIn: '1h' },
    }), ConfigModule],
    controllers: [AuthController],
    providers: [AuthService, { provide: 'Hasher', useClass: BcryptAdapter }]
})
export class AuthModule { }
