import { IsArray, IsNumber } from 'class-validator';

export class CreateRolePermissionsDto {
  @IsNumber()
  role_id: number;

  @IsArray()
  permission_id: number[];
}
