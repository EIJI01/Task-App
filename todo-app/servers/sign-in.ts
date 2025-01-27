"use server";

import { API_POST } from "@/lib/api-requests";
import { TypeOfSignInForm, TypeOfSignInResponse } from "@/lib/types";
import { createSession } from "./session";
import { redirect } from "next/navigation";

export async function login(formData: TypeOfSignInForm) {
  const response = await API_POST<TypeOfSignInForm, TypeOfSignInResponse>(
    formData,
    "/auth/login",
    undefined,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (response.success) {
    const { token } = response.data;
    await createSession(token);
    redirect("/");
  }
  return response;
}
