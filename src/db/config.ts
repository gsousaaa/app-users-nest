import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const typeOrmConfig = async (
    configService: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
    type: 'postgres',
    host: configService.get<string>('PG_HOST'),
    database: configService.get<string>('PG_DATABASE'),
    username: configService.get<string>('PG_USERNAME'),
    password: configService.get<string>('PG_PASSWORD'),
    port: configService.get<number>('PG_PORT'),
    retryAttempts: 10,
    retryDelay: 3000,
    autoLoadEntities: true,
    synchronize: false,
    ssl: false
});