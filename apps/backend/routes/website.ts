import { prisma } from "db/client";
import { Router } from "express";
import { CreateWebsiteSchema } from "types/types";
import { authmiddleware } from "../middleware/authmiddleware";

const router = Router();

router.post("/create-website", authmiddleware, async (req, res) => {
  const data = req.body;
  const parsedData = CreateWebsiteSchema.safeParse(data);

  if (!parsedData.success) {
    res.status(400).json({
      message: "Invalid/Incorrect Inputs provided",
    });
  }

  const { name, url } = parsedData.data!;

  const website = await prisma.website.create({
    data: {
      name,
      url,
      userId: req.userId!,
    },
  });
  res.status(201).json({
    message: "Website Created successfully",
    id: website.id,
  });
});

router.post("/status/:websiteId", authmiddleware, async (req, res) => {
  const websiteId = req.params.websiteId;

  const website = await prisma.website.findUnique({
    where: {
      id: websiteId,
      userId: req.userId,
    },
  });

  if (!website) {
    res.status(404).json({ message: "Website not found" });
    return;
  }
});

export default router;
