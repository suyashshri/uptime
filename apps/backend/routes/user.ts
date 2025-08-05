import Router from "express";
import { SignUpSchema, VerfityOtpSchema } from "types/types";
import { prisma } from "db/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SendMail } from "../utils/resend";

const router = Router();

router.post("/signup", async (req, res) => {
  const data = req.body;
  const paresedData = SignUpSchema.safeParse(data);

  if (!paresedData.success) {
    res.status(400).json({
      message: "Invalid/Incorrect Inputs provided",
    });
  }

  const { username, email, password } = paresedData.data!;

  const hashedPassword = await bcrypt.hash(password, 10);

  const otp = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");

  const response = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      otp,
    },
  });

  await SendMail(email, otp);
  res.status(200).json({
    message: "Signup successful. OTP sent to email.",
  });
});

router.post("/verify-otp", async (req, res) => {
  const data = req.body;
  const paresedData = VerfityOtpSchema.safeParse(data);
  if (!paresedData.success) {
    res.status(400).json({
      message: "Invalid/Incorrect Inputs provided",
    });
  }

  const { email, otp } = paresedData.data!;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  if (user.isVerified) {
    res.status(400).json({ message: "User already verified" });
    return;
  }
  if (user.otp != otp) {
    res.status(401).json({ message: "Invalid or expired OTP" });
    return;
  }

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      isVerified: true,
    },
  });

  const token = jwt.sign({ userId: user.id, email }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  res.status(200).json({ message: "Verified successfully", token });
});

router.post("/signin", (req, res) => {});

export default router;
