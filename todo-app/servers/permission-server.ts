import { protectedRoutes } from "@/lib/routes-server";
import { UserType } from "@/lib/types";
const allowRoute: { [key: string]: string[] } = {
  ADMIN: [...protectedRoutes, "/dashboard"],
  USER: [...protectedRoutes],
};

export async function verifyRoute(user: UserType, route: string) {
  const routes =
    user?.roles.reduce((acc: string[], role) => {
      return [...new Set([...acc, ...allowRoute[role]])];
    }, []) || [];
  const isAllow = routes.some((path) => path.match(route));
  return isAllow;
}
