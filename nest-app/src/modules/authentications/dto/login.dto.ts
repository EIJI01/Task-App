import { IsEmail, IsString } from 'class-validator';

export class LoginRequest {
  @IsEmail()
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export class LoginResponse {
  success: boolean;
  token: {
    accessToken: string;
    refreshToken: string;
  };
}
