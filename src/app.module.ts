import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersController } from './modules/users/users.controller';
import { AuthMiddleware } from './common/middlewares/AuthMiddleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { parseEnv } from './env';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './db/config';
import { UsersModule } from './modules/users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule,
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true, validate: parseEnv }),
    TypeOrmModule.forRootAsync({ imports: [ConfigModule], inject: [ConfigService], useFactory: typeOrmConfig })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private readonly jwtService: JwtService) { }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply((req, res, next) => {
      const middleware = new AuthMiddleware(this.jwtService)
      middleware.use(req, res, next)
    }).forRoutes(UsersController)
  }
}
