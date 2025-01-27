import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getExpiresTokenDate(token: string) {
  const tokenDecode = parseJWT(token);
  return tokenDecode?.exp;
}

export function parseJWT(token: string | undefined = "") {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export function getInitialName(name: string | undefined = "") {
  const sliceName = name.slice(0, 2);
  const result = sliceName.charAt(0).toUpperCase() + name.charAt(1);
  return result;
}
