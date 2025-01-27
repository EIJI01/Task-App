"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSignInSchema } from "@/lib/schema";
import { TypeOfSignInForm, Error_Response } from "@/lib/types";
import { login } from "@/servers/sign-in";
import { ErrorMassage } from "@/components/error";
import { Loader2 } from "lucide-react";

const SignInForm = () => {
  const [error, setError] = useState<Error_Response | null>(null);
  const [loading, setLoading] = useState(false);

  const defaultValues: TypeOfSignInForm = {
    username: "",
    password: "",
  };
  const form = useForm<TypeOfSignInForm>({
    resolver: zodResolver(formSignInSchema),
    defaultValues: defaultValues,
  });

  async function onSubmit(values: TypeOfSignInForm) {
    setLoading(true);
    setError(null);
    const result = await login(values);
    console.log(result);
    if (!result.success) {
      setLoading(false);
      setError(result);
    }
    setLoading(false);
  }

  return (
    <Card className="w-[450px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="text-theme-text-main text-2xl">
              Sign <span className="text-theme-blue">In</span>
            </CardTitle>
            <CardDescription className="text-theme-text-second">
              If you already have an account, you can sign in with it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className=" text-theme-text-main ">Username/Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Username/Email of your account."
                          className="placeholder:text-theme-text-second "
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className=" text-theme-text-main">Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          aria-autocomplete="none"
                          placeholder="Password of your account."
                          className="placeholder:text-theme-text-second"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="block">
            <Button type="submit" className="w-full bg-[#007FFF] hover:bg-[#007FFF]/80" disabled={loading}>
              {loading && <Loader2 className="animate-spin" />}
              Sign In
            </Button>
            {error && <ErrorMassage error={error} className="text-center" />}
            <div className="text-end hover:underline text-sm pt-2 pb-4 text-theme-text-second">
              <Link href={"#"}>forgot password?</Link>
            </div>
            <div className="text-center text-sm">
              Don&apos;t have an account? |{" "}
              <Link href={"/sign-up"} className="hover:underline">
                Sign <span className="text-theme-blue">Up</span>
              </Link>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export { SignInForm };
