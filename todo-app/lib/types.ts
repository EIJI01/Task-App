import { z } from "zod";
import { formSignInSchema, formSignUpSchema } from "./schema";

export type TypeOfSignInForm = z.infer<typeof formSignInSchema>;
export type TypeOfSignUpForm = z.infer<typeof formSignUpSchema>;
export type TypeOfSignInResponse = { success: boolean; token: { accessToken: string; refreshToken: string } };
export type TypeOfRefreshResponse = {
  success: boolean;
  token: { accessToken: string; refreshToken: string };
};
export type TypeOfSignUpResponse = { success: boolean; statusCode: number };

export type TypeRequest = "GET" | "POST" | "PATCH" | "DELETE";

export type Api_Response<T> = { success: true; data: T };
export type TypeError = { message: string; statusCode: number };
export type Error_Response = { success: false } & TypeError;

export type Payload = { accessToken: string; refreshToken: string };
export type Token = { sub: number; username: string; iat: number; exp: number; aud: string; iss: string };

export type UserType = {
  id: number;
  name: string;
  email: string;
  profile_picture?: string | null;
  created_at: Date;
  updated_at: Date;
  roles: string[];
  roles_permissions: { [role: string]: string[] };
  user_permissions: string[];
};

export type User = {
  name: string;
  password: string;
  profile_picture: string | null;
  id: number;
  email: string;
  created_at: Date;
  updated_at: Date;
};

export type TaskType = {
  id: number;
  created_at: Date;
  updated_at: Date;
  user_id: number;
  title: string;
  description: string;
  is_completed: boolean;
  completed_at: Date | null;
};

export type CreateTask = {
  user_id: number;
  title: string;
  description: string;
  is_completed?: boolean;
};

export type Months =
  | "January"
  | "February"
  | "March"
  | "April"
  | "May"
  | "June"
  | "July"
  | "August"
  | "September"
  | "October"
  | "November"
  | "December";

export type AreaChartType = {
  month: Months;
  total_complete: number;
  total_todo: number;
};

export type AreaThisMonthChartType = {
  date: Date;
  total_complete: number;
  total_todo: number;
};
