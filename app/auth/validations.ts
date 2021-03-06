import { z } from "zod"

const password = z.string().min(10).max(100)

export const Signup = z.object({
  email: z.string().email(),
  handle: z.string().min(3),
  password,
})

export const Login = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const ForgotPassword = z.object({
  email: z.string().email(),
})

export const ResetPassword = z
  .object({
    password: password,
    passwordConfirmation: password,
    token: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"], // set the path of the error
  })

export const ChangePassword = z.object({
  currentPassword: password,
  newPassword: password,
  newRepeat: password,
})

export const ChangeEmail = z.object({
  email: z.string().email(),
})

export const ChangeName = z.object({
  name: z.string(),
})
