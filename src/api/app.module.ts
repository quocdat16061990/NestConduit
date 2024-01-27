import { Module } from '@nestjs/common';
import { UserModule } from './controller/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { environmentConfiguration } from 'src/infrastructure/enviroment-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/domain/entities/user';
import { typeOrmConfigOptions } from 'src/infrastructure/type-orm-config';
import { AuthModule } from 'src/infrastructure/auth';
import { UploadFileModule } from './controller/upload-file/upload-file.module';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { join } from 'path';
@Module({
  imports: [
    AuthModule,
    UserModule,
    UploadFileModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'conduit'),
      serveRoot: 'uploads/avatar',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [environmentConfiguration],
    }),
    TypeOrmModule.forRoot(typeOrmConfigOptions),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
