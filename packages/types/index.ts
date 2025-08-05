import z from "zod";

export const SignUpSchema = z.object({
  username: z.string().min(3),
  email: z.email(),
  password: z.string(),
});

export const VerfityOtpSchema = z.object({
  email: z.email(),
  otp: z.string().length(6),
});

export const SignInSchema = z.object({
  email: z.email(),
  password: z.string(),
});
