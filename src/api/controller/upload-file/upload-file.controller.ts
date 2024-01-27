import {
  Controller,
  Post,
  Get,
  Param,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { extname, join } from 'path';
import { storageConfig } from 'src/infrastructure/helpers/config';
import { Response } from 'express';

@Controller('upload-file')
export class UploadFileController {
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: storageConfig('avatar'),
    }),
  )
  @ApiOperation({ summary: 'Upload a file' })
  @ApiResponse({ status: 200, description: 'File uploaded successfully' })
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<any> {
    if (!file) {
      throw new Error('No File Upload');
    }

    const imagePath = `uploads/avatar/${file.filename}`;

    return {
      message: 'Upload File Successfully',
      url: `${process.env.BASE_URL }/${imagePath}`,
    };
  }

  @Get('avatar/:filename')
  async getAvatar(
    @Param('filename') filename: string,
    @Res() res: Response,
  ): Promise<void> {
    const filePath = join(
      process.cwd(),
      '..',
      'conduit',
      'uploads',
      'avatar',
      filename,
    );
    res.sendFile(filePath);
  }
}
