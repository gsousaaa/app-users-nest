import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BcryptAdapter } from 'src/common/adapters/bcrypt.adapter';

@Module({
    controllers: [AuthController],
    providers: [AuthService, { provide: 'Hasher', useClass: BcryptAdapter }]
})
export class AuthModule { }
