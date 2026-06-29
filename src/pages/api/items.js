import prisma from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";

export default async function handler(req, res) {
  const { location, expiring } = req.query;
  const userId = await getSessionUserId(req, res);

  if (!userId)
    return res.status(401).json({ error: "Authentication required" });

  const where = { userId };

  if (location) {
    where.location = location.toUpperCase();
  }

  if (expiring === "true") {
    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);

    where.expiresAt = {
      gte: now,
      lte: threeDaysFromNow,
    };
  }

  try {
    const items = await prisma.item.findMany({
      where,
      orderBy: { expiresAt: "asc" },
    });

    return res.status(200).json(items);
  } catch (error) {
    console.error("Items DB error:", error.message);
    return res.status(503).json({ error: "Failed to load items" });
  }
}
