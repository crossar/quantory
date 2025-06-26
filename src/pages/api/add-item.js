import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, location, quantity, expiresAt, userId } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const item = await prisma.item.create({
      data: {
        name,
        location: location.toUpperCase(),
        quantity: parseInt(quantity),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        userId,
      },
    });

    res.status(200).json(item);
  } catch (err) {
    console.error('Error adding item:', err);
    res.status(500).json({ error: 'Failed to add item' });
  }
}
