import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const userId = parseInt(req.query.userId || req.body?.userId);

  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  if (req.method === "POST") {
    const { name, quantity, location, expiresAt } = req.body;

    try {
      const newItem = await prisma.toBuyItem.create({
        data: {
          name,
          quantity,
          location,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
          userId,
        },
      });

      return res.status(200).json(newItem);
    } catch (error) {
      console.error("Error creating to-buy item:", error);
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
      const updatedItem = await prisma.toBuyItem.update({
        where: {
          id: parseInt(id),
        },
        data: {
          name,
          quantity,
        },
      });

      return res.status(200).json(updatedItem);
    } catch (error) {
      console.error("Error updating to-buy item:", error);
      return res.status(500).json({ error: "Failed to update item" });
    }
  } else {
    // ✅ This else now belongs properly inside the handler
    return res.status(405).json({ error: "Method not allowed" });
  }
}
