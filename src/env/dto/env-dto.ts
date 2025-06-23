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
    PG_HOST: string

    @IsNotEmpty()
    PG_USERNAME: string

    @IsNotEmpty()
    PG_PORT: string

    @IsNotEmpty()
    PG_PASSWORD: string

    @IsNotEmpty()
    PG_DATABASE: string
}