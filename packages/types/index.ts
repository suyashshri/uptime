import z from "zod";

export const SignUpSchema = z.object({
  username: z.string().min(3),
  email: z.email(),
  password: z.string(),
});
