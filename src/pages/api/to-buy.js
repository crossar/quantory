import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, quantity, location, expiresAt } = req.body;

    // ✅ Get user from headers
    const userHeader = req.headers["user"];
    const user = userHeader ? JSON.parse(userHeader) : null;
    const userId = user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    try {
      const newItem = await prisma.toBuyItem.create({
        data: {
          name,
          quantity,
          location,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
          userId, // ✅ save userId
        },
      });
      res.status(200).json(newItem);
    } catch (error) {
      console.error("Error creating to-buy item:", error);
      res.status(500).json({ error: "Failed to create to-buy item" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
