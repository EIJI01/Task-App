import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  password: string;

  @IsOptional()
  @IsString()
  profile_picture?: string;
}
