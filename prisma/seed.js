const { PrismaClient } = require("../src/generated/prisma");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const DEMO_USERNAME = "demo";
const DEMO_EMAIL = "demo@example.com";
const DEMO_PASSWORD = process.env.DEMO_ACCOUNT_PASSWORD || "demo12345";

const demoInventory = [
  { name: "Greek Yogurt", location: "FRIDGE", quantity: 4, expiresInDays: 5 },
  { name: "Spinach", location: "FRIDGE", quantity: 1, expiresInDays: 2 },
  {
    name: "Chicken Breasts",
    location: "FREEZER",
    quantity: 6,
    expiresInDays: 90,
  },
  {
    name: "Frozen Berries",
    location: "FREEZER",
    quantity: 2,
    expiresInDays: 45,
  },
  { name: "Pasta", location: "PANTRY", quantity: 3, expiresInDays: 180 },
  {
    name: "Black Beans",
    location: "PANTRY",
    quantity: 6,
    expiresInDays: 365,
  },
  {
    name: "Paper Towels",
    location: "STORAGE",
    quantity: 8,
    expiresInDays: null,
  },
  {
    name: "Laundry Pods",
    location: "STORAGE",
    quantity: 24,
    expiresInDays: null,
  },
  {
    name: "Ibuprofen",
    location: "MEDICINE",
    quantity: 1,
    expiresInDays: 120,
  },
  {
    name: "Bandages",
    location: "MEDICINE",
    quantity: 2,
    expiresInDays: 365,
  },
];

const demoToBuy = [
  { name: "Eggs", quantity: 1, location: "FRIDGE" },
  { name: "Ground Turkey", quantity: 2, location: "FREEZER" },
  { name: "Olive Oil", quantity: 1, location: "PANTRY" },
  { name: "Dish Soap", quantity: 1, location: "STORAGE" },
  { name: "Vitamin C", quantity: 1, location: "MEDICINE" },
];

function toDateFromNow(days) {
  if (days == null) {
    return null;
  }

  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const user = await prisma.user.upsert({
    where: { username: DEMO_USERNAME },
    update: {
      email: DEMO_EMAIL,
      passwordHash,
      firstName: "Demo",
      lastName: "User",
      name: "Demo User",
    },
    create: {
      username: DEMO_USERNAME,
      email: DEMO_EMAIL,
      passwordHash,
      firstName: "Demo",
      lastName: "User",
      name: "Demo User",
    },
  });

  const inventoryData = demoInventory.map((item) => ({
    userId: user.id,
    name: item.name,
    location: item.location,
    quantity: item.quantity,
    expiresAt: toDateFromNow(item.expiresInDays),
  }));

  const toBuyData = demoToBuy.map((item) => ({
    userId: user.id,
    name: item.name,
    quantity: item.quantity,
    location: item.location,
  }));

  await prisma.$transaction([
    prisma.toBuyItem.deleteMany({ where: { userId: user.id } }),
    prisma.item.deleteMany({ where: { userId: user.id } }),
    prisma.item.createMany({ data: inventoryData }),
    prisma.toBuyItem.createMany({ data: toBuyData }),
  ]);
}

main()
  .catch((error) => console.error(error))
  .finally(() => prisma.$disconnect());
