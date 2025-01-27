"use server";
import React from "react";
import { SignUpForm } from "./components/signUp-form";

const SignUpPage = async () => {
  return (
    <div className="h-full flex justify-center items-center">
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
