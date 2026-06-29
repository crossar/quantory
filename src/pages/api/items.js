import prisma from "@/lib/prisma";
import { getFallbackItems } from "@/lib/itemFallback";

export default async function handler(req, res) {
  const { location, expiring, userId } = req.query;

  if (!userId) return res.status(401).json({ error: "User ID required" });

  let where = { userId: parseInt(userId) };

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
  }

  const filters = {
    location: location ? location.toUpperCase() : null,
    expiring: expiring === "true",
  };

  const fallbackItems = await getFallbackItems(parseInt(userId), filters);
  res.status(200).json(fallbackItems);
}
