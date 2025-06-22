import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const typeOrmConfig = async (
    configService: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
    type: 'mysql',
    host: configService.get<string>('MYSQL_HOST'),
    database: configService.get<string>('MYSQL_DATABASE'),
    username: configService.get<string>('MYSQL_USERNAME'),
    password: configService.get<string>('MYSQL_PASSWORD'),
    port: configService.get<number>('MYSQL_PORT'),
    autoLoadEntities: true,
    synchronize: false,
});