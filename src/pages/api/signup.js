import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

console.log('DATABASE_URL:', process.env.DATABASE_URL);


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { username, password, firstName, lastName } = req.body;

    if (!username || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        firstName,
        lastName,
        uuid: user.id,
      },
    });

    res.status(200).json({
      user: {
        id: newUser.id,
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
    });
  } catch (error) {
  console.error('Signup error:', error);
  res.status(500).json({ error: 'Internal Server Error' });
}
}
