import { IsEnum, IsNotEmpty, IsNumberString } from 'class-validator';

export enum Environment {
    DEV = 'dev',
    PROD = 'prod',
    TEST = 'test',
}

export class EnvValidation {
    @IsNumberString()
    PORT: string;

    @IsEnum(Environment)
    NODE_ENV: Environment;

    @IsNotEmpty()
    JWT_SECRET_KEY: string;

    @IsNotEmpty()
    MYSQL_HOST: string

    @IsNotEmpty()
    MYSQL_USERNAME: string

    @IsNotEmpty()
    MYSQL_PORT: string

    @IsNotEmpty()
    MYSQL_PASSWORD: string

    @IsNotEmpty()
    MYSQL_DATABASE: string
}