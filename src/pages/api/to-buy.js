import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const userId = parseInt(req.query.userId || req.body?.userId);

  console.log(
    "[API /to-buy]",
    req.method,
    "userId=",
    userId,
    "query=",
    req.query,
    "body=",
    req.body
  );

  if (!userId) {
    console.warn("[API /to-buy] No userId provided");
    return res.status(401).json({ error: "User not authenticated" });
  }

  if (req.method === "POST") {
    const { name, quantity, userId, location } = req.body;

    console.log("[API /to-buy POST]", { name, quantity, userId, location });

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

      console.log("[API /to-buy POST] created:", newItem);
      return res.status(200).json(newItem);
    } catch (error) {
      console.error("❌ Error creating to-buy item:", error);
      return res.status(500).json({ error: "Failed to create to-buy item" });
    }
  } else if (req.method === "GET") {
    try {
      console.log("[API /to-buy GET] fetching items for userId:", userId);

      const items = await prisma.toBuyItem.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

      console.log("[API /to-buy GET] found items:", items.length);
      return res.status(200).json(items);
    } catch (error) {
      console.error("❌ Error fetching to-buy items:", error);
      return res.status(500).json({ error: "Failed to fetch items" });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.body;

    console.log("[API /to-buy DELETE]", { id, userId });

    try {
      await prisma.toBuyItem.deleteMany({
        where: {
          id: parseInt(id),
          userId,
        },
      });

      console.log("[API /to-buy DELETE] deleted id:", id);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("❌ Error deleting to-buy item:", error);
      return res.status(500).json({ error: "Failed to delete item" });
    }
  } else if (req.method === "PUT") {
    const { id, name, quantity } = req.body;

    console.log("[API /to-buy PUT]", { id, name, quantity });

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

      console.log("[API /to-buy PUT] updated:", updatedItem);
      return res.status(200).json(updatedItem);
    } catch (error) {
      console.error("❌ Error updating to-buy item:", error.message);
      return res.status(500).json({ error: "Failed to update to-buy item" });
    }
  } else {
    console.warn("[API /to-buy] Method not allowed:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }
}
