"use client";

import { ErrorMassage } from "@/components/error";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formSignUpSchema } from "@/lib/schema";
import { TypeOfSignUpForm, Error_Response } from "@/lib/types";
import { register } from "@/servers/sign-up";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const SignUpForm = () => {
  const [error, setError] = useState<Error_Response | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<TypeOfSignUpForm>({
    resolver: zodResolver(formSignUpSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      confirm_password: "",
    },
  });

  async function onSubmit(value: TypeOfSignUpForm) {
    setError(null);
    setLoading(true);
    const response = await register(value);
    if (response) {
      setLoading(false);
      setError(response);
    }
  }
  return (
    <Card className="w-[450px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="text-theme-text-main text-2xl">
              Sign <span className="text-theme-blue">Up</span>
            </CardTitle>
            <CardDescription className="text-theme-text-second">
              If you don&apos;t have an account, you can sign up here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name" className=" text-theme-text-main ">
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          aria-autocomplete="none"
                          id="name"
                          placeholder="First/Last Name"
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
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="username" className=" text-theme-text-main ">
                        Username/Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id="email"
                          placeholder="Username/Email"
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
                      <FormLabel htmlFor="password" className=" text-theme-text-main ">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          aria-autocomplete="none"
                          id="password"
                          placeholder="Password"
                          className="placeholder:text-theme-text-second"
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
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="confirm_password" className=" text-theme-text-main ">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          aria-autocomplete="none"
                          id="confirm_password"
                          placeholder="Confirm Password"
                          className="placeholder:text-theme-text-second "
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
              Sign Up
            </Button>
            {error && <ErrorMassage error={error} className="text-center" />}
            <div className="text-center text-sm pt-4">
              Already have an account? |{" "}
              <Link href={"/sign-in"} className="hover:underline">
                Sign <span className="text-theme-blue">In</span>
              </Link>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export { SignUpForm };
