import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, location, quantity, expiresAt } = req.body;

  // ✅ Get logged-in user from localStorage (on frontend) or send manually
  const user = JSON.parse(req.headers['user']); // we'll send this from frontend

  if (!user || !user.id) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const item = await prisma.item.create({
      data: {
        name,
        location: location.toUpperCase(),
        quantity: parseInt(quantity),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        userId: user.id, // ✅ new!
      },
    });

    res.status(200).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add item' });
  }
}
