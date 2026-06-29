import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { verifyFallbackUser } from "@/lib/authFallback";

export default async function handler(req, res) {
  res.setHeader("X-Route", "pages-api-login-v1");

  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return res.status(200).json({
        user: {
          id: user.id,
          username: user.username,
          firstName: user.firstName || null,
          lastName: user.lastName || null,
        },
      });
    }
  } catch (error) {
    console.error("Login DB error:", error.message);
  }

  const fallbackUser = await verifyFallbackUser(username, password);
  if (fallbackUser) {
    return res.status(200).json({ user: fallbackUser });
  }

  return res.status(401).json({ error: "Invalid credentials" });
}
