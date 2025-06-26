import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const userId = parseInt(req.query.userId || req.body?.userId); // for GET or POST

  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  if (req.method === 'POST') {
    const { name, quantity, location, expiresAt } = req.body;

    try {
      const newItem = await prisma.toBuyItem.create({
        data: {
          name,
          quantity,
          location,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
          userId,
        },
      });

      res.status(200).json(newItem);
    } catch (error) {
      console.error('Error creating to-buy item:', error);
      res.status(500).json({ error: 'Failed to create to-buy item' });
    }
  } else if (req.method === 'GET') {
    try {
      const items = await prisma.toBuyItem.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      res.status(200).json(items);
    } catch (error) {
      console.error('Error fetching to-buy items:', error);
      res.status(500).json({ error: 'Failed to fetch items' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
