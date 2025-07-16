import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Missing name" });

  const item = await prisma.toBuyItem.create({
    data: { name },
  });

  res.status(200).json(item);
}
