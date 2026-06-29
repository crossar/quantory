const toBuyStorage = (globalThis.__homeventoryToBuyItems ??= new Map());

let nextId = 2000;

function getToBuyKey(userId) {
  return `tobuy_user_${userId}`;
}

export async function createFallbackToBuyItem({
  userId,
  name,
  quantity,
  location,
}) {
  const key = getToBuyKey(userId);
  const userItems = toBuyStorage.get(key) ?? [];

  const newItem = {
    id: nextId++,
    userId,
    name,
    quantity: parseInt(quantity),
    location,
    createdAt: new Date().toISOString(),
  };

  userItems.push(newItem);
  toBuyStorage.set(key, userItems);

  return newItem;
}

export async function getFallbackToBuyItems(userId) {
  const key = getToBuyKey(userId);
  return toBuyStorage.get(key) ?? [];
}

export async function deleteFallbackToBuyItem(id) {
  for (const [key, userItems] of toBuyStorage.entries()) {
    const index = userItems.findIndex((i) => i.id === id);
    if (index !== -1) {
      const deleted = userItems.splice(index, 1)[0];
      toBuyStorage.set(key, userItems);
      return deleted;
    }
  }
  return null;
}
