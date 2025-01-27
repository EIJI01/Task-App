"use server";
import { Api_Response, User, Error_Response } from "@/lib/types";
import { verifySession } from "./session";
import { API_PATCH, API_POST } from "@/lib/api-requests";
import { UploadFileResponse } from "@/components/edit-profile";
import { parseJWT } from "@/lib/utils";

export async function upload(formData: FormData): Promise<Api_Response<UploadFileResponse> | Error_Response> {
  const session = await verifySession();

  const response = await API_POST<FormData, UploadFileResponse>(formData, "/upload/file", undefined, {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
    body: formData,
    redirect: "follow",
  });

  return response;
}

export async function editProfile(updateUser: Partial<User>): Promise<Api_Response<User> | Error_Response> {
  const session = await verifySession();
  const response = await API_PATCH<Partial<User>, User>(updateUser, "/profile/edit", undefined, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  return response;
}
