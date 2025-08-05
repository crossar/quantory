import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const userId = parseInt(req.query.userId || req.body?.userId);

  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  if (req.method === "POST") {
    const { name, quantity, location } = req.body;

    if (!name || quantity == null || !userId || !location) {
      return res.status(400).json({ error: "Missing data" });
    }

    try {
      const newItem = await prisma.toBuyItem.create({
        data: {
          name,
          quantity,
          userId,
          location,
        },
      });

      return res.status(200).json(newItem);
    } catch (error) {
      console.error("❌ Error creating to-buy item:", error);
      return res.status(500).json({ error: "Failed to create to-buy item" });
    }
  } else if (req.method === "GET") {
    try {
      const items = await prisma.toBuyItem.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json(items);
    } catch (error) {
      console.error("Error fetching to-buy items:", error);
      return res.status(500).json({ error: "Failed to fetch items" });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.body;

    try {
      await prisma.toBuyItem.deleteMany({
        where: {
          id: parseInt(id),
          userId,
        },
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error deleting to-buy item:", error);
      return res.status(500).json({ error: "Failed to delete item" });
    }
  } else if (req.method === "PUT") {
    const { id, name, quantity } = req.body;

    if (!id || !name || quantity == null) {
      return res.status(400).json({ error: "Missing data" });
    }

    try {
      const newItem = await prisma.toBuyItem.create({
        data: {
          name,
          quantity,
          userId: parsedUserId,
        },
      });

      return res.status(200).json(updatedItem);
    } catch (error) {
      console.error(
        "❌ Error creating to-buy item:",
        error.message,
        error.stack
      );

      return res.status(500).json({ error: "Failed to create to-buy item" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
