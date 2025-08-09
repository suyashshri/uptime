import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export const authmiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token as string,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    req.userId = decoded.userId; // Attach the decoded token payload to request
    next();
  } catch (err) {
    res.status(403).json({ message: "Forbidden: Invalid or expired token" });
    return;
  }
};
