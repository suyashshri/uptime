import { prisma } from "db/client";
import { Router } from "express";
import { CreateWebsiteSchema } from "types/types";
import { authmiddleware } from "../middleware/authmiddleware";

const router = Router();

router.post("/create-website", authmiddleware, async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      error,
      message: "Error creating website",
    });
    return;
  }
});

router.post("/status/:websiteId", authmiddleware, async (req, res) => {
  try {
    const websiteId = req.params.websiteId;

    const website = await prisma.website.findUnique({
      where: {
        id: websiteId,
        userId: req.userId,
      },
      include: {
        WebsiteTicks: {
          orderBy: {
            createAt: "desc",
          },
        },
      },
    });

    if (!website) {
      res.status(404).json({ message: "Website not found" });
      return;
    }

    res.status(201).json({ message: "Website Status", website });
    return;
  } catch (error) {
    res.status(500).json({
      error,
      message: "Error finding status of this website",
    });
    return;
  }
});

router.post("/status/all", authmiddleware, async (req, res) => {
  try {
    const websites = await prisma.website.findMany({
      where: {
        userId: req.userId,
      },
      include: {
        WebsiteTicks: {
          orderBy: [
            {
              createAt: "desc",
            },
          ],
          take: 1,
        },
      },
    });
    if (!websites) {
      res.status(404).json({ message: "Website not found" });
      return;
    }
    res.status(201).json({ message: "Website Status", websites });
    return;
  } catch (error) {
    res.status(500).json({
      error,
      message: "Error finding status of all website",
    });
    return;
  }
});

export default router;
