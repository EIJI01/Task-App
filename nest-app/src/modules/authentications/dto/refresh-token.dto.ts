import { IsEmail, IsOptional, IsString } from 'class-validator';

export class RefreshTokenRequest {
  @IsString()
  refresh_token: string;
}

export class RefreshTokenResponse {
  success: boolean;
  token: {
    accessToken: string;
    refreshToken: string;
  };
}
