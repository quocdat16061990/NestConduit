import { Module } from '@nestjs/common';
import { UploadFileController } from './upload-file.controller';
import { MulterModule } from '@nestjs/platform-express';
@Module({
  imports: [MulterModule.register({ dest: './upload' })],
  controllers: [UploadFileController],
  providers: [],
})
export class UploadFileModule {}
