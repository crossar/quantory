import prisma from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id, name, quantity, expiresAt } = req.body;
  const userId = await getSessionUserId(req, res);

  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  if (!id || !name || quantity == null) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const result = await prisma.item.updateMany({
      where: { id: parseInt(id), userId },
      data: {
        name,
        quantity: parseInt(quantity),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    if (!result.count) {
      return res.status(404).json({ error: "Item not found" });
    }

    const updated = await prisma.item.findFirst({
      where: { id: parseInt(id), userId },
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error("Edit-item DB error:", error.message);
    return res.status(503).json({ error: "Failed to update item" });
  }
}
