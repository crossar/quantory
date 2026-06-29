import prisma from "@/lib/prisma";
import { updateFallbackItem } from "@/lib/itemFallback";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id, name, quantity, expiresAt } = req.body;

  if (!id || !name || quantity == null) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const updated = await prisma.item.update({
      where: { id },
      data: {
        name,
        quantity: parseInt(quantity),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error("Edit-item DB error:", error.message);
  }

  const updated = await updateFallbackItem(parseInt(id), {
    name,
    quantity: parseInt(quantity),
    expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
  });

  if (updated) {
    return res.status(200).json(updated);
  }

  res.status(404).json({ error: "Item not found" });
}
