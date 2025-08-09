import Router from "express";
import { SignInSchema, SignUpSchema, VerfityOtpSchema } from "types/types";
import { prisma } from "db/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import { SendMail } from "../utils/resend";

const router = Router();

router.post("/signup", async (req, res) => {
  try {
    const data = req.body;
    const parsedData = SignUpSchema.safeParse(data);

    if (!parsedData.success) {
      res.status(400).json({
        message: "Invalid/Incorrect Inputs provided",
      });
    }

    const { username, email, password } = parsedData.data!;
    const hashedPassword = await bcrypt.hash(password, 10);

    //   const otp = Array.from({ length: 6 }, () =>
    //     Math.floor(Math.random() * 10)
    //   ).join("");
    const otp = "111111";

    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        otp,
      },
    });

    //   remeber to uncomment it in PROD as we have limited mail so can't use in devlopment
    //   await SendMail(email, otp);

    res.status(200).json({
      message: "Signup successful. OTP sent to email.",
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: "Error Occured while signing up.Please try after sometime",
    });
    return;
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const data = req.body;
    const parsedData = VerfityOtpSchema.safeParse(data);
    if (!parsedData.success) {
      res.status(400).json({
        message: "Invalid/Incorrect Inputs provided",
      });
    }

    const { email, otp } = parsedData.data!;

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

    const token = jwt.sign(
      { userId: user.id, email },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({ message: "Verified successfully", token });
  } catch (error) {
    res.status(500).json({
      error,
      message: "Error Occured while verfying OTP.Please try after sometime",
    });
    return;
  }
});

router.post("/signin", async (req, res) => {
  try {
    const data = req.body;
    const parsedData = SignInSchema.safeParse(data);
    if (!parsedData.success) {
      res.status(400).json({
        message: "Invalid/Incorrect Inputs provided",
      });
    }

    const { email, password } = parsedData.data!;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (!user.isVerified) {
      res.status(400).json({ message: "User not verified" });
      return;
    }

    const isValid = bcrypt.compare(password, user.password);

    if (!isValid) {
      res.status(403).json({ message: "User not authorized" });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({ message: "SignIn successfully", token });
  } catch (error) {
    res.status(500).json({
      error,
      message: "Error Occured while signing in.Please try after sometime",
    });
    return;
  }
});

export default router;
