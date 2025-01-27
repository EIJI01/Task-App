import { API_POST } from "@/lib/api-requests";
import { TypeOfSignUpForm, TypeOfSignUpResponse } from "@/lib/types";
import { redirect } from "next/navigation";

export const register = async (data: TypeOfSignUpForm) => {
  const response = await API_POST<TypeOfSignUpForm, TypeOfSignUpResponse>(data, "/auth/register", undefined, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.success) {
    return response;
  }
  redirect("/sign-in");
};
