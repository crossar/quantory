const { PrismaClient } = require("../src/generated/prisma");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("demo12345", 10);

  const user = await prisma.user.upsert({
    where: { username: "demo" },
    update: {
      email: "demo@example.com",
      passwordHash,
      firstName: "Demo",
      lastName: "User",
      name: "Demo User",
    },
    create: {
      username: "demo",
      email: "demo@example.com",
      passwordHash,
      firstName: "Demo",
      lastName: "User",
      name: "Demo User",
    },
  });

  const items = [
    { name: "Milk", location: "FRIDGE", quantity: 1, userId: user.id },
    { name: "Peas", location: "FREEZER", quantity: 2, userId: user.id },
    { name: "Cereal", location: "PANTRY", quantity: 3, userId: user.id },
  ];

  for (const item of items) {
    const existing = await prisma.item.findFirst({
      where: {
        userId: item.userId,
        name: item.name,
        location: item.location,
      },
    });

    if (existing) {
      await prisma.item.update({
        where: { id: existing.id },
        data: { quantity: item.quantity },
      });
      continue;
    }

    await prisma.item.create({ data: item });
  }
}

main()
  .catch((error) => console.error(error))
  .finally(() => prisma.$disconnect());
