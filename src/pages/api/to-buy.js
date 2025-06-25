import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, quantity, location, expiresAt, userId } = req.body;

    if (!userId) {
      console.log("❌ Missing userId in request body");
      return res.status(401).json({ error: "User not authenticated" });
    }

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
  }

  if (req.method === "GET") {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const items = await prisma.toBuyItem.findMany({
        where: { userId: parseInt(userId) },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json(items);
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch items" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
