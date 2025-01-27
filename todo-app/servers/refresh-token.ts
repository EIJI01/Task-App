import { API_POST } from "@/lib/api-requests";
import { Api_Response, Error_Response, Payload, TypeOfRefreshResponse } from "@/lib/types";

export async function refreshToken(
  refreshToken: string
): Promise<Api_Response<TypeOfRefreshResponse> | Error_Response> {
  const response = await API_POST<{ refresh_token: string }, TypeOfRefreshResponse>(
    { refresh_token: refreshToken },
    "/auth/refresh-token",
    undefined,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
}
