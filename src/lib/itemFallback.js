const itemStorage = (globalThis.__homeventoryItems ??= new Map());

let nextId = 1000;

function getItemsKey(userId) {
  return `user_${userId}`;
}

export async function createFallbackItem({
  userId,
  name,
  location,
  quantity,
  expiresAt,
}) {
  const key = getItemsKey(userId);
  const userItems = itemStorage.get(key) ?? [];

  const newItem = {
    id: nextId++,
    userId,
    name,
    location,
    quantity: parseInt(quantity),
    expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
    createdAt: new Date().toISOString(),
  };

  userItems.push(newItem);
  itemStorage.set(key, userItems);

  return newItem;
}

export async function getFallbackItems(userId, filters = {}) {
  const key = getItemsKey(userId);
  let items = itemStorage.get(key) ?? [];

  if (filters.location) {
    items = items.filter((item) => item.location === filters.location);
  }

  if (filters.expiring) {
    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);

    items = items.filter((item) => {
      if (!item.expiresAt) return false;
      const expiresDate = new Date(item.expiresAt);
      return expiresDate >= now && expiresDate <= threeDaysFromNow;
    });
  }

  return items;
}

export async function updateFallbackItem(id, updates) {
  for (const [key, userItems] of itemStorage.entries()) {
    const item = userItems.find((i) => i.id === id);
    if (item) {
      Object.assign(item, updates);
      return item;
    }
  }
  return null;
}

export async function deleteFallbackItem(id) {
  for (const [key, userItems] of itemStorage.entries()) {
    const index = userItems.findIndex((i) => i.id === id);
    if (index !== -1) {
      const deleted = userItems.splice(index, 1)[0];
      itemStorage.set(key, userItems);
      return deleted;
    }
  }
  return null;
}
