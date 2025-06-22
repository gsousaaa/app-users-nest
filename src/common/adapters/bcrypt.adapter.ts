import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export interface HashService {
    hash(plain: string): Promise<string>,
    compare(plain: string, hashed: string): Promise<Boolean>
}


@Injectable()
export class BcryptAdapter implements HashService {
    private readonly salt = 10;

    async hash(plain: string): Promise<string> {
        return bcrypt.hash(plain, this.salt)
    }

    async compare(plain: string, hashed: string) {
        return bcrypt.compare(plain, hashed)
    }
}
