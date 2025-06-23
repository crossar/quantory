import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, name, quantity, expiresAt } = req.body;

  if (!id || !name || quantity == null) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const updated = await prisma.item.update({
      where: { id },
      data: {
        name,
        quantity: parseInt(quantity),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update item' });
  }
}
