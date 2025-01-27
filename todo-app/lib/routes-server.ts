import { headers } from "next/headers";

export const protectedRoutes = ["/", "/complete-tasks", "/edit-profile"];
export const publicRoutes = ["/sign-in", "/sign-up"];
export const errorRoutes = ["/error-forbidden"];

export async function getPathNameFromHeader() {
  const pathname = (await headers()).get("x-nextjs-pathname") || "";
  return pathname;
}
