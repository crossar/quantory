import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

function normalizeUsername(username) {
  return username?.trim().toLowerCase();
}

function isDatabaseConnectionError(error) {
  const message = error instanceof Error ? error.message : String(error);
  return /Error querying the database|Can't reach database server|tenant\/user/i.test(
    message,
  );
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { username, password, firstName, lastName } = req.body;
    const normalizedUsername = normalizeUsername(username);

    if (!normalizedUsername || !password || !firstName || !lastName) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { username: normalizedUsername },
    });

    if (existingUser) {
      return res.status(400).json({
        error: "An account with that username already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const name = `${firstName.trim()} ${lastName.trim()}`.trim();

    const newUser = await prisma.user.create({
      data: {
        username: normalizedUsername,
        passwordHash,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name,
      },
    });

    return res.status(201).json({
      user: {
        id: newUser.id,
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        name: newUser.name,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    if (isDatabaseConnectionError(error)) {
      return res.status(503).json({
        error:
          "Database unavailable. Signup cannot complete until the database connection is fixed.",
      });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
}
