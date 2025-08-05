import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  console.log("Using DATABASE_URL:", process.env.DATABASE_URL);
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { username, password } = req.body;

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.status(200).json({
    user: {
      id: user.id,
      username: user.username,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
    },
  });
}
