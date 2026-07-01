import bcrypt from "bcryptjs";

export const DEMO_USERNAME = "demo";
export const DEMO_EMAIL = "demo@example.com";
export const DEMO_PASSWORD = process.env.DEMO_ACCOUNT_PASSWORD || "demo12345";

const DEMO_PROFILE = {
  firstName: "Demo",
  lastName: "User",
  name: "Demo User",
};

const DEMO_INVENTORY_TEMPLATE = [
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
  { name: "Black Beans", location: "PANTRY", quantity: 6, expiresInDays: 365 },
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
    name: "Trash Bags",
    location: "HOUSEHOLD",
    quantity: 2,
    expiresInDays: null,
  },
  {
    name: "Dish Sponges",
    location: "HOUSEHOLD",
    quantity: 4,
    expiresInDays: null,
  },
  { name: "Ibuprofen", location: "MEDICINE", quantity: 1, expiresInDays: 120 },
  { name: "Bandages", location: "MEDICINE", quantity: 2, expiresInDays: 365 },
];

const DEMO_TO_BUY_TEMPLATE = [
  { name: "Eggs", quantity: 1, location: "FRIDGE" },
  { name: "Ground Turkey", quantity: 2, location: "FREEZER" },
  { name: "Olive Oil", quantity: 1, location: "PANTRY" },
  { name: "Dish Soap", quantity: 1, location: "STORAGE" },
  { name: "Paper Towels", quantity: 2, location: "HOUSEHOLD" },
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

function buildDemoInventoryData(userId) {
  return DEMO_INVENTORY_TEMPLATE.map((item) => ({
    name: item.name,
    location: item.location,
    quantity: item.quantity,
    expiresAt: toDateFromNow(item.expiresInDays),
    userId,
  }));
}

function buildDemoToBuyData(userId) {
  return DEMO_TO_BUY_TEMPLATE.map((item) => ({
    name: item.name,
    quantity: item.quantity,
    location: item.location,
    userId,
  }));
}

export async function ensureDemoUserWithSeed(prisma) {
  const existingDemoUser = await prisma.user.findUnique({
    where: { username: DEMO_USERNAME },
  });

  let demoUser = existingDemoUser;

  if (!demoUser) {
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

    demoUser = await prisma.user.create({
      data: {
        username: DEMO_USERNAME,
        email: DEMO_EMAIL,
        passwordHash,
        ...DEMO_PROFILE,
      },
    });
  } else {
    const updateData = {
      email: DEMO_EMAIL,
      ...DEMO_PROFILE,
    };

    if (!demoUser.passwordHash) {
      updateData.passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
    }

    demoUser = await prisma.user.update({
      where: { id: demoUser.id },
      data: updateData,
    });
  }

  const itemData = buildDemoInventoryData(demoUser.id);
  const toBuyData = buildDemoToBuyData(demoUser.id);

  await prisma.$transaction([
    prisma.toBuyItem.deleteMany({ where: { userId: demoUser.id } }),
    prisma.item.deleteMany({ where: { userId: demoUser.id } }),
    prisma.item.createMany({ data: itemData }),
    prisma.toBuyItem.createMany({ data: toBuyData }),
  ]);

  return demoUser;
}
