import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UploadFileService } from './upload-files.service';
import {
  UploadFileResponse,
  UploadsFileResponse,
} from './upload-file.interface';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

const KB_5 = 0.5 * 1024 * 1024;
const MB_2 = 2 * 1024 * 1024;
const MB_5 = 5 * 1024 * 1024;

@Controller('upload')
export class UploadFileController {
  constructor(private readonly uploadService: UploadFileService) {}

  @Post('file')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: MB_5,
      },
    }),
  )
  async upload(
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<UploadFileResponse> {
    return await this.uploadService.UploadSingleFile(file);
  }

  @Post('files')
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      limits: {
        fileSize: MB_2,
      },
    }),
  )
  async uploads(
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<UploadsFileResponse> {
    return await this.uploadService.UploadMultipleFile(files);
  }
}
