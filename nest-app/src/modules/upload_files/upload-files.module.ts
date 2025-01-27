import { BadRequestException, Module } from '@nestjs/common';
import { UploadFileController } from './upload-files.controller';
import { UploadFileService } from './upload-files.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

const BASE_PATH = './uploads';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: (_, file, callback) => {
          let uploadPath = BASE_PATH;
          if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
            uploadPath = `${uploadPath}/image-file`;
          } else if (file.mimetype.match(/\/pdf$/)) {
            uploadPath = `${uploadPath}/pdf-file`;
          }

          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          callback(null, uploadPath);
        },
        filename: (_, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (_, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
          return callback(new BadRequestException('Invalid file type'), false);
        }
        callback(null, true);
      },
    }),
  ],
  controllers: [UploadFileController],
  providers: [UploadFileService],
  exports: [UploadFileService],
})
export class UploadFileModule {}
