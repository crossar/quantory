const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.item.createMany({
    data: [
      { name: 'Milk', location: 'FRIDGE', quantity: 1 },
      { name: 'Peas', location: 'FREEZER', quantity: 2 },
      { name: 'Cereal', location: 'PANTRY', quantity: 3 },
    ],
  });
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
