import prisma from "@/lib/prisma";
import { createFallbackToBuyItem } from "@/lib/toBuyFallback";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, quantity, userId, location } = req.body;

  if (!name || !userId)
    return res.status(400).json({ error: "Missing required fields" });

  try {
    const item = await prisma.toBuyItem.create({
      data: { name, quantity, userId, location },
    });
    return res.status(200).json(item);
  } catch (error) {
    console.error("Add-to-buy DB error:", error.message);

    if (process.env.NODE_ENV !== "production") {
      const fallbackItem = await createFallbackToBuyItem({
        userId,
        name,
        quantity: quantity || 1,
        location: location || "Unspecified",
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
