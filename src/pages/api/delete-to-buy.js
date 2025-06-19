import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).end();

  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'Missing id' });

  await prisma.toBuyItem.delete({ where: { id: parseInt(id) } });
  res.status(200).json({ message: 'Deleted' });
}
