import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const items = await prisma.toBuyItem.findMany({ orderBy: { id: 'asc' } });
    return res.status(200).json(items);
  }

  if (req.method === 'POST') {
    const { name, location } = req.body;

const newItem = await prisma.toBuyItem.create({
  data: {
    name: name.trim(),
    location: location || 'unspecified',
  },
});


    return res.status(201).json(newItem);
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'ID is required' });

    await prisma.toBuyItem.delete({ where: { id } });
    return res.status(204).end();
  }

  if (req.method === 'PUT') {
    const { id, name } = req.body;
    if (!id || !name || name.trim() === '') {
      return res.status(400).json({ error: 'ID and name are required' });
    }

    const updatedItem = await prisma.toBuyItem.update({
      where: { id },
      data: { name: name.trim() },
    });

    return res.status(200).json(updatedItem);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
