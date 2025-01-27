import { Injectable } from '@nestjs/common';
import {
  UploadFileResponse,
  UploadsFileResponse,
} from './upload-file.interface';

@Injectable()
export class UploadFileService {
  async UploadSingleFile(
    file: Express.Multer.File,
  ): Promise<UploadFileResponse> {
    const BASE_DOMAIN = process.env.BASE_PATH_FILE;
    return {
      success: true,
      file_path: `${BASE_DOMAIN}/${file.path}`,
    } as UploadFileResponse;
  }

  async UploadMultipleFile(
    files: Array<Express.Multer.File>,
  ): Promise<UploadsFileResponse> {
    return {
      success: true,
      file_path: files.map((file) => file.path),
    } as UploadsFileResponse;
  }
}
