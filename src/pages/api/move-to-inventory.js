import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id, userId } = req.body;

  if (!id || !userId) {
    return res.status(400).json({ error: "Missing item ID or user ID" });
  }

  try {
    const item = await prisma.toBuyItem.findFirst({
      where: {
        id: parseInt(id),
        userId: parseInt(userId),
      },
    });

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    await prisma.item.create({
      data: {
        name: item.name,
        location: item.location,
        quantity: item.quantity || 1,
        expiresAt: item.expiresAt ? new Date(item.expiresAt) : null,
        userId: item.userId,
      },
    });

    await prisma.toBuyItem.delete({ where: { id: parseInt(id) } });

    return res.status(200).json({ message: "Moved to inventory" });
  } catch (error) {
    console.error("Move failed:", error);
    return res.status(500).json({ error: "Failed to move item" });
  }
}
