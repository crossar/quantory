import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const items = await prisma.toBuyItem.findMany({ orderBy: { id: 'asc' } });
    return res.status(200).json(items);
  }

  if (req.method === 'POST') {
    const { name } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Item name is required' });
    }

    const newItem = await prisma.toBuyItem.create({
      data: { name: name.trim() },
    });

    return res.status(201).json(newItem);
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'ID is required' });

    await prisma.toBuyItem.delete({ where: { id } });
    return res.status(204).end();
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
