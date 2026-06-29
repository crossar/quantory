import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

function normalizeEmail(email) {
  return email?.trim().toLowerCase();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { email, password, firstName, lastName } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password || !firstName || !lastName) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "An account with that email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const name = `${firstName.trim()} ${lastName.trim()}`.trim();

    const newUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name,
      },
    });

    return res.status(201).json({
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        name: newUser.name,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
