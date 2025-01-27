"use server";

import React from "react";
import { SignInForm } from "./components/signIn-form";

const SignInPage = async () => {
  return (
    <div className="h-full flex items-center justify-center">
      <SignInForm />
    </div>
  );
};

export default SignInPage;
