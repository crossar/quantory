import prisma from "@/lib/prisma";
import { createFallbackItem } from "@/lib/itemFallback";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, location, quantity, expiresAt, userId } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  try {
    const item = await prisma.item.create({
      data: {
        name,
        location: location.toUpperCase(),
        quantity: parseInt(quantity),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        userId,
      },
    });

    return res.status(200).json(item);
  } catch (error) {
    console.error("Add-item DB error:", error.message);

    if (process.env.NODE_ENV !== "production") {
      const fallbackItem = await createFallbackItem({
        userId,
        name,
        location: location.toUpperCase(),
        quantity,
        expiresAt,
      });

      return res.status(200).json({
        ...fallbackItem,
        storage: "fallback",
        warning:
          "Database unavailable. Item is stored only in temporary memory.",
      });
    }

    return res.status(503).json({
      error: "Database unavailable. Item was not saved.",
    });
  }
}
