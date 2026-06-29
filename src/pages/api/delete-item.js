import prisma from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.body;
  const userId = await getSessionUserId(req, res);

  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  if (!id) {
    return res.status(400).json({ error: "Missing item ID" });
  }

  try {
    const result = await prisma.item.deleteMany({
      where: { id: parseInt(id), userId },
    });

    if (!result.count) {
      return res.status(404).json({ error: "Item not found" });
    }

    return res.status(200).json({ message: "Item deleted" });
  } catch (error) {
    console.error("Delete-item DB error:", error.message);
    return res.status(503).json({ error: "Failed to delete item" });
  }
}
