import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({ message: "DB working ✅", users });
  } catch (error) {
    console.error("DB test error:", error.message);
    res.status(500).json({ error: "❌ DB failed", details: error.message });
  }
}
