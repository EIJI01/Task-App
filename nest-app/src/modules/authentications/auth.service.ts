import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginRequest, LoginResponse } from './dto/login.dto';
import { RegisterRequest, RegisterResponse } from './dto/register.dto';
import { UserRoleService } from '../user_role/user_role.service';
import { RoleService } from '../role/role.service';
import * as bcrypt from 'bcrypt';
import {
  RefreshTokenRequest,
  RefreshTokenResponse,
} from './dto/refresh-token.dto';
import { RedisService } from '../data_access/redis/redis.service';

const [PREFIX, KEY_ALL] = ['REFRESH_TOKEN', 'ALL'];

@Injectable()
export class AuthService {
  constructor(
    private readonly roleService: RoleService,
    private readonly userRoleService: UserRoleService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async signUp(request: RegisterRequest): Promise<RegisterResponse> {
    const user = await this.userService.findByUsernameOrEmail(request.username);
    if (user) {
      throw new HttpException('User already exist.', HttpStatus.BAD_REQUEST);
    }

    const passwordHash = await this.hashPassword(request.password);

    const userResult = await this.userService.create({
      name: request.name,
      email: request.username,
      password: passwordHash,
      profile_picture: request.profile_picture,
    } as any);

    if (!userResult) throw new InternalServerErrorException();

    const role = await this.roleService.findRoleByName('USER');

    if (!role) throw new NotFoundException();

    const userRoleResult = await this.userRoleService.create({
      user_id: userResult.id,
      role_id: role.id,
    } as any);

    if (!userRoleResult) throw new InternalServerErrorException();

    return { success: true, statusCode: HttpStatus.OK };
  }

  async signIn(request: LoginRequest): Promise<LoginResponse> {
    const user = await this.userService.findByUsernameOrEmail(request.username);
    if (
      !user ||
      !(await this.verifyPassword(request.password, user.password))
    ) {
      throw new HttpException(
        'Invalid username/password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = { sub: user.id, username: user.email };
    const { access_token, refresh_token } = await this.generate_token(payload);

    await this.save_refreshToken(user.id, refresh_token);

    return {
      success: true,
      token: { accessToken: access_token, refreshToken: refresh_token },
    } as LoginResponse;
  }

  async refreshToken(
    request: RefreshTokenRequest,
  ): Promise<RefreshTokenResponse> {
    console.log('refresh token start.');
    const decode = await this.jwtService.verifyAsync(request.refresh_token, {
      secret: process.env.SECRET_REFRESH_KEY,
    });

    if (!decode) throw new UnauthorizedException('Invalid refresh token');

    const valid = await this.validate_refreshToken(
      decode.sub,
      request.refresh_token,
    );

    if (!valid) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.userService.findOne(decode.sub);
    const payload = { sub: user.id, username: user.email };
    const { access_token, refresh_token } = await this.generate_token(payload);

    await this.save_refreshToken(user.id, refresh_token);

    return {
      success: true,
      token: { accessToken: access_token, refreshToken: refresh_token },
    } as RefreshTokenResponse;
  }

  private async save_refreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    await this.redisService.setWithExpiry(
      PREFIX,
      userId.toString(),
      refreshToken,
      259200,
    );
  }

  private async generate_token(
    payload: object,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.SECRET_KEY,
      expiresIn: process.env.EXPIRES_IN_ACCESS,
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: process.env.SECRET_REFRESH_KEY,
      expiresIn: process.env.EXPIRES_IN_REFRESH,
    });
    return { access_token, refresh_token };
  }

  private async validate_refreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<boolean> {
    const stored_token = await this.redisService.get(PREFIX, userId.toString());
    if (!stored_token) return false;

    return stored_token === refreshToken;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, saltRounds);
    return btoa(hash);
  }

  private async verifyPassword(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    const decodeBase64 = atob(passwordHash);
    return await bcrypt.compare(password, decodeBase64);
  }
}
