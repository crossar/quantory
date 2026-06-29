import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createFallbackUser } from "@/lib/authFallback";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { username, password, firstName, lastName } = req.body;

    if (!username || !password || !firstName || !lastName) {
      return res.status(400).json({ error: "Missing fields" });
    }

    try {
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }
    } catch (error) {
      console.error("Signup DB lookup error:", error.message);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const newUser = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          firstName,
          lastName,
        },
      });

      return res.status(200).json({
        user: {
          id: newUser.id,
          username: newUser.username,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
        },
      });
    } catch (error) {
      console.error("Signup DB create error:", error.message);
    }

    const fallbackUser = await createFallbackUser({
      username,
      password,
      firstName,
      lastName,
    });

    return res.status(200).json({ user: fallbackUser });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
