import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, quantity, location, expiresAt } = req.body;

  if (!name || !quantity || !location) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newItem = await prisma.item.create({
      data: {
        name,
        quantity: parseInt(quantity),
        location, 
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });
    res.status(200).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add item' });
  }
}
