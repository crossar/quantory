import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { location } = req.query;

  if (!location) {
    return res.status(400).json({ error: 'Missing location parameter' });
  }

  const items = await prisma.item.findMany({
    where: {
      location: location.toUpperCase(),
    },
    orderBy: { name: 'asc' },
  });

  res.status(200).json(items);
}
