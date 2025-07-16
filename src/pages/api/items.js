import prisma from "@/lib/prisma";

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

    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
}
