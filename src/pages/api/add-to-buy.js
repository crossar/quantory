import prisma from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const userId = await getSessionUserId(req, res);
  const { name, quantity, location } = req.body;

  if (!name || !userId)
    return res.status(400).json({ error: "Missing required fields" });

  try {
    const item = await prisma.toBuyItem.create({
      data: { name, quantity, userId, location },
    });
    return res.status(200).json(item);
  } catch (error) {
    console.error("Add-to-buy DB error:", error.message);

    return res.status(503).json({
      error: "Database unavailable. Item was not saved.",
    });
  }
}
