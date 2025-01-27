import { z } from "zod";

export const formSignUpSchema = z
  .object({
    name: z
      .string()
      .nonempty({ message: "Please enter name." })
      .min(2, { message: "Name must be at least 2 characters long." })
      .trim(),
    username: z
      .string()
      .nonempty({ message: "Please enter username." })
      .email({ message: "Please enter a valid email." })
      .trim(),
    password: z
      .string()
      .nonempty({ message: "Please enter password." })
      .min(8, { message: "Be at least 8 characters long" })
      .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
      .regex(/[0-9]/, { message: "Contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Contain at least one special character.",
      })
      .trim(),
    confirm_password: z.string().nonempty({ message: "Please enter confirm password." }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Password don't match",
    path: ["confirm_password"],
  });

export const formSignInSchema = z.object({
  username: z
    .string()
    .nonempty({ message: "please enter your email." })
    .email({ message: "Please enter a valid email." })
    .trim(),
  password: z.string().nonempty({ message: "Please enter your password." }).trim(),
});

export const formTaskCreate = z.object({
  title: z.string().nonempty({ message: "Please enter title" }).trim(),
  description: z.string(),
});

export const formEditSchema = z.object({
  name: z.string().trim(),
});
