import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  try {
    const now = await prisma.$queryRaw`SELECT NOW()`;
    res.status(200).json({ time: now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
