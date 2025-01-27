"use server";

import { API_GET } from "@/lib/api-requests";
import { verifySession } from "./session";
import { Error_Response, UserType, Api_Response } from "@/lib/types";

export async function userSession(): Promise<Error_Response | Api_Response<UserType>> {
  const session = await verifySession();
  const response = await API_GET<UserType>("/users/roles-permissions", undefined, {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });
  return response;
}
