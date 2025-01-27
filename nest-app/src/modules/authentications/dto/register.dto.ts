import { IsEmail, IsOptional, IsString } from 'class-validator';

export class RegisterRequest {
  @IsString()
  name: string;

  @IsEmail()
  username: string;

  @IsString()
  password: string;

  @IsOptional()
  profile_picture?: string;
}

export class RegisterResponse {
  success: boolean;
  statusCode: number;
}
