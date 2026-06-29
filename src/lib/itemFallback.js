import { readFallbackStore, updateFallbackStore } from "@/lib/fallbackStore";

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
  let newItem;

  await updateFallbackStore((store) => {
    newItem = {
      id: store.counters.itemId++,
      userId: parseInt(userId),
      name,
      location,
      quantity: parseInt(quantity),
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      createdAt: new Date().toISOString(),
    };

    store.items.push(newItem);
    return store;
  });

  return newItem;
}

export async function getFallbackItems(userId, filters = {}) {
  const normalizedUserId = parseInt(userId);
  let items = (await readFallbackStore()).items.filter(
    (item) => item.userId === normalizedUserId,
  );

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
  let updatedItem = null;

  await updateFallbackStore((store) => {
    const item = store.items.find((entry) => entry.id === id);
    if (!item) {
      return store;
    }

    Object.assign(item, updates);
    updatedItem = item;
    return store;
  });

  return updatedItem;
}

export async function deleteFallbackItem(id) {
  let deletedItem = null;

  await updateFallbackStore((store) => {
    const index = store.items.findIndex((item) => item.id === id);
    if (index === -1) {
      return store;
    }

    deletedItem = store.items.splice(index, 1)[0];
    return store;
  });

  return deletedItem;
}
