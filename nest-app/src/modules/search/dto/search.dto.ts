import { IsString } from 'class-validator';

export class SearchTitleTaskRequest {
  @IsString()
  title: string;
}
