import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRolePermission } from '../user/user.interface';

export type Role = 'ADMIN' | 'USER';
export type PermissionTypes =
  | 'CREATE:TASK'
  | 'UPDATE:TASK'
  | 'DELATE:TASK'
  | 'VIEW:TASK'
  | 'ALL:TASK'
  | 'COMPLETE:TASK'
  | 'SEARCH:TASK'
  | 'FILTER:TASK'
  | 'CREATE:NOTE'
  | 'UPDATE:NOTE'
  | 'DELETE:NOTE'
  | 'DELETE:ALL-TASKS'
  | 'COMPLETE:ALL-TASKS'
  | 'VIEW:COMPLETE-TASKS';

const AUTHORIZE_KEY = 'authorize';

export const Authorize = ({
  roles,
  permissions,
}: {
  roles?: Role[];
  permissions?: PermissionTypes[];
}) =>
  SetMetadata(AUTHORIZE_KEY, {
    roles: roles ?? undefined,
    permissions: permissions ?? undefined,
  } as {
    roles: Role[] | undefined;
    permissions: PermissionTypes[] | undefined;
  });

@Injectable()
export class AuthorizeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authorize = this.reflector.getAllAndOverride<{
      roles: Role[] | undefined;
      permissions: PermissionTypes[] | undefined;
    }>(AUTHORIZE_KEY, [context.getHandler(), context.getClass()]);

    if (!authorize) return true;

    const { user } = context
      .switchToHttp()
      .getRequest<{ user: UserRolePermission }>();

    const { roles, permissions } = authorize;

    if (roles && !roles.some((role) => user.roles.includes(role)))
      throw new ForbiddenException('You do not have the required role.');

    if (permissions && !this.permissionExist(permissions, user))
      throw new ForbiddenException('You do not have the required permission.');

    return true;
  }

  private async permissionExist(
    permissions: PermissionTypes[],
    user: UserRolePermission,
  ): Promise<boolean> {
    const roles_permissions = user.roles.flatMap(
      (role) => user.roles_permissions[role],
    );
    const sum_permission = new Set([
      ...roles_permissions,
      ...user.user_permissions,
    ]);

    console.log(sum_permission);
    return permissions.some((p) => sum_permission.has(p));
  }
}
