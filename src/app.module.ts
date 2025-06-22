import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { AuthMiddleware } from './common/middlewares/AuthMiddleware';

@Module({
  imports: [AuthModule],
  controllers: [AppController, AuthController, UsersController],
  providers: [AppService, AuthService, UsersService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(UsersController)
  }
}
