import prisma from "@/lib/prisma";

function mapToLocationEnum(locationStr) {
  const map = {
    fridge: "FRIDGE",
    freezer: "FREEZER",
    pantry: "PANTRY",
    "storage-room": "STORAGE",
    medicine: "MEDICINE",
  };
  return map[locationStr] || "PANTRY"; // fallback if unknown
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id, userId } = req.body;

  if (!id || !userId) {
    return res.status(400).json({ error: "Missing item ID or user ID" });
  }

  try {
    // Fetch the item AND verify it belongs to this user
    const item = await prisma.toBuyItem.findFirst({
      where: {
        id: parseInt(id),
        userId: parseInt(userId),
      },
    });

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Add to inventory using the correct quantity and location
    await prisma.item.create({
      data: {
        name: item.name,
        location: mapToLocationEnum(item.location),
        quantity: item.quantity || 1,
        expiresAt: item.expiresAt ? new Date(item.expiresAt) : null,
        userId: item.userId,
      },
    });

    // Remove from to-buy list
    await prisma.toBuyItem.delete({ where: { id: parseInt(id) } });

    return res.status(200).json({ message: "Moved to inventory" });
  } catch (error) {
    console.error("Move failed:", error);
    return res.status(500).json({ error: "Failed to move item" });
  }
}
