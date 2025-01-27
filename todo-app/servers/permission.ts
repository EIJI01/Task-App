import { UserType } from "@/lib/types";

export type Permission =
  | "create:task"
  | "update:task"
  | "delete:task"
  | "view:task"
  | "all:task"
  | "complete:task"
  | "search:task"
  | "filter:task"
  | "create:note"
  | "update:note"
  | "delete:note"
  | "delete:all-tasks"
  | "all:complete-tasks"
  | "view:complete-tasks"
  | "update:complete-tasks"
  | "update:profile"
  | "view:profile";

export type Role = "user" | "admin";

export class UserPermission {
  public user: UserType | null;

  constructor(user: UserType | null) {
    this.user = user;
  }

  has({ permissions, roles }: Partial<{ permissions?: Permission[]; roles?: Role[] }>) {
    const upperPermissions = permissions?.map((permission) => permission.toUpperCase()) || [];
    const upperRoles = roles?.map((role) => role.toUpperCase()) || [];

    const rolePermissions =
      this.user?.roles.reduce((acc: string[], role: string) => {
        return [...acc, ...(this.user?.roles_permissions[role] || [])];
      }, []) || [];
    const allUserPermissions = new Set([...rolePermissions, ...(this.user?.user_permissions || [])]);

    const hasPermission =
      upperPermissions.length === 0 ||
      upperPermissions.some((permission) =>
        Array.from(allUserPermissions).some((userPermission) => permission.match(userPermission))
      );

    const hasRole =
      upperRoles.length === 0 ||
      this.user?.roles.some((role) => upperRoles.some((r) => r === role.toUpperCase())) ||
      false;

    return hasPermission && hasRole;
  }
}
