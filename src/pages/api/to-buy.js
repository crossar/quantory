import prisma from "@/lib/prisma";
import {
  createFallbackToBuyItem,
  getFallbackToBuyItems,
  deleteFallbackToBuyItem,
} from "@/lib/toBuyFallback";

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
    req.body,
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
      console.error("To-buy POST DB error:", error.message);
    }

    const fallbackItem = await createFallbackToBuyItem({
      userId,
      name,
      quantity,
      location,
    });

    return res.status(200).json(fallbackItem);
  } else if (req.method === "GET") {
    try {
      console.log("[API /to-buy GET] fetching items for userId:", userId);

      const items = await prisma.toBuyItem.findMany({
        where: { userId },
        orderBy: { id: "desc" },
      });

      console.log("[API /to-buy GET] found items:", items.length);
      return res.status(200).json(items);
    } catch (error) {
      console.error("To-buy GET DB error:", error.message);
    }

    const fallbackItems = await getFallbackToBuyItems(userId);
    return res.status(200).json(fallbackItems);
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
      console.error("To-buy DELETE DB error:", error.message);
    }

    const deleted = await deleteFallbackToBuyItem(parseInt(id));
    if (deleted) {
      return res.status(200).json({ success: true });
    }

    return res.status(404).json({ error: "Item not found" });
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
      console.error("To-buy PUT DB error:", error.message);
    }

    res.status(500).json({ error: "Failed to update to-buy item" });
  } else {
    console.warn("[API /to-buy] Method not allowed:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }
}
