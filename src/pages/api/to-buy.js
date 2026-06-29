import prisma from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const userId = await getSessionUserId(req, res);

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
      console.error("To-buy POST DB error:", error.message);
      return res.status(503).json({
        error: "Database unavailable. Item was not saved.",
      });
    }
  } else if (req.method === "GET") {
    try {
      const items = await prisma.toBuyItem.findMany({
        where: { userId },
        orderBy: { id: "desc" },
      });
      return res.status(200).json(items);
    } catch (error) {
      console.error("To-buy GET DB error:", error.message);
      return res.status(503).json({ error: "Failed to load to-buy items" });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.body;

    try {
      const result = await prisma.toBuyItem.deleteMany({
        where: {
          id: parseInt(id),
          userId,
        },
      });

      if (!result.count) {
        return res.status(404).json({ error: "Item not found" });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("To-buy DELETE DB error:", error.message);
      return res.status(503).json({ error: "Failed to delete to-buy item" });
    }
  } else if (req.method === "PUT") {
    const { id, name, quantity } = req.body;

    if (!id || !name || quantity == null) {
      return res.status(400).json({ error: "Missing data" });
    }

    try {
      const result = await prisma.toBuyItem.updateMany({
        where: {
          id: parseInt(id),
          userId,
        },
        data: {
          name,
          quantity,
        },
      });

      if (!result.count) {
        return res.status(404).json({ error: "Item not found" });
      }

      const updatedItem = await prisma.toBuyItem.findFirst({
        where: { id: parseInt(id), userId },
      });

      return res.status(200).json(updatedItem);
    } catch (error) {
      console.error("To-buy PUT DB error:", error.message);
      return res.status(503).json({ error: "Failed to update to-buy item" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
