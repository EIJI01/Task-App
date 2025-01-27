import "server-only";
import { NODE_ENV, SECRET_KEY } from "@/lib/configs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Payload, TypeOfRefreshResponse } from "@/lib/types";
import { parseJWT } from "@/lib/utils";
import { refreshToken } from "./refresh-token";

const key = new TextEncoder().encode(SECRET_KEY);
export async function encrypt(payload: Partial<Payload>, exp: number) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(key);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });

    return payload as Partial<Payload>;
  } catch (error: any) {
    return null;
  }
}

export async function createSessionAccess(acc: string) {
  const { exp } = parseJWT(acc);
}

export async function createSession(payload: Payload) {
  const { exp } = parseJWT(payload.accessToken);
  const refreshPayload = parseJWT(payload.refreshToken);
  const expiresAt = new Date(exp * 1000);
  const session = await encrypt({ accessToken: payload.accessToken }, exp);
  const sessionRefresh = await encrypt({ refreshToken: payload.refreshToken }, refreshPayload.exp);
  const expiresRefreshAt = new Date(refreshPayload.exp * 1000);

  (await cookies()).set("session", session, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });

  (await cookies()).set("session_refresh", sessionRefresh, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    expires: expiresRefreshAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function verifySession() {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  if (!session || !session.accessToken) {
    console.log("token expires.");
    const cookie = (await cookies()).get("session_refresh")?.value;
    const sessionRefresh = await decrypt(cookie);
    if (!sessionRefresh || !sessionRefresh.refreshToken) {
      return null;
    }
    const response = await refreshToken(sessionRefresh.refreshToken);
    if (response.success) {
      const { token } = response.data;
      await updateSession(token);
      return token;
    } else {
      return null;
    }
  }
  return session;
}

export async function updateSession(newPayload: Payload) {
  await createSession(newPayload);
}

export async function deleteSession() {
  const cookie = (await cookies()).get("session")?.value;
  if (cookie) {
    (await cookies()).delete("session");
    (await cookies()).delete("session_refresh");
    redirect("/sign-in");
  }
}
