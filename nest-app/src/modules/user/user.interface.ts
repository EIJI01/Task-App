export interface UserInfo {
  id: number;
  name: string;
  email: string;
  profile_picture?: string | null;
  created_at: Date;
  updated_at: Date;
  UserRole: {
    user_id: number;
    role_id: number;
    created_at: Date;
    Role: {
      id: number;
      role_name: string;
      created_at: Date;
      updated_at: Date;
      RolePermission: {
        role_id: number;
        permission_id: number;
        created_at: Date;
        Permission: {
          id: number;
          name: string;
        };
      }[];
    };
  }[];
  UserPermission: {
    user_id: number;
    permission_id: number;
    created_at: Date;
    Permission: {
      id: number;
      name: string;
      created_at: Date;
      updated_at: Date;
    };
  }[];
}

export interface UserRolePermission {
  id: number;
  name: string;
  email: string;
  profile_picture?: string | null;
  created_at: Date;
  updated_at: Date;
  roles: string[];
  roles_permissions: { [role: string]: string[] };
  user_permissions: string[];
}
