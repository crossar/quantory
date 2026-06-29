import prisma from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const userId = await getSessionUserId(req, res);
  const { name, location, quantity, expiresAt } = req.body;

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

    return res.status(503).json({
      error: "Database unavailable. Item was not saved.",
    });
  }
}
