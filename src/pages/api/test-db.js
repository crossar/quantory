import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  try {
    const userCount = await prisma.user.count();
    res.status(200).json({ ok: true, userCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
