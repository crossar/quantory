import prisma from "@/lib/prisma";
import { deleteFallbackItem } from "@/lib/itemFallback";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Missing item ID" });
  }

  try {
    await prisma.item.delete({
      where: { id: parseInt(id) },
    });
    return res.status(200).json({ message: "Item deleted" });
  } catch (error) {
    console.error("Delete-item DB error:", error.message);
  }

  const deleted = await deleteFallbackItem(parseInt(id));
  if (deleted) {
    return res.status(200).json({ message: "Item deleted" });
  }

  res.status(404).json({ error: "Item not found" });
}
