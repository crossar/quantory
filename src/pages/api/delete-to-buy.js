import prisma from "@/lib/prisma";
import { deleteFallbackToBuyItem } from "@/lib/toBuyFallback";

export default async function handler(req, res) {
  if (req.method !== "DELETE") return res.status(405).end();

  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "Missing id" });

  try {
    await prisma.toBuyItem.delete({ where: { id: parseInt(id) } });
    return res.status(200).json({ message: "Deleted" });
  } catch (error) {
    console.error("Delete-to-buy DB error:", error.message);
  }

  const deleted = await deleteFallbackToBuyItem(parseInt(id));
  if (deleted) {
    return res.status(200).json({ message: "Deleted" });
  }

  res.status(404).json({ error: "Item not found" });
}
