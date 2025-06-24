import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const items = await prisma.toBuyItem.findMany({ orderBy: { id: 'asc' } });
    res.json(items);
  } else if (req.method === 'POST') {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const newItem = await prisma.toBuyItem.create({
      data: { name: name.trim() },
    });

    res.status(201).json(newItem);
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    await prisma.toBuyItem.delete({ where: { id } });
    res.status(204).end();
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
