import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { MulterModule } from '@nestjs/platform-express';
import { UserService } from 'src/application/user/user.service';
import { UserRepositoryModule } from 'src/infrastructure/repositories/user/user-repository.module';
@Module({
  imports: [UserRepositoryModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
