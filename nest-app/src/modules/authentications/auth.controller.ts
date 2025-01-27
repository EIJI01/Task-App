import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequest, LoginResponse } from './dto/login.dto';
import { RegisterRequest, RegisterResponse } from './dto/register.dto';
import { Public } from '../guards/auth.guard';
import {
  RefreshTokenRequest,
  RefreshTokenResponse,
} from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Public()
  @Post('/register')
  async register(@Body() request: RegisterRequest): Promise<RegisterResponse> {
    return await this.service.signUp(request);
  }

  @Public()
  @Post('/login')
  async login(@Body() request: LoginRequest): Promise<LoginResponse> {
    return await this.service.signIn(request);
  }

  @Public()
  @Post('/refresh-token')
  async refreshToken(
    @Body() request: RefreshTokenRequest,
  ): Promise<RefreshTokenResponse> {
    return await this.service.refreshToken(request);
  }
}
