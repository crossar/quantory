import { readFallbackStore, updateFallbackStore } from "@/lib/fallbackStore";

function getToBuyKey(userId) {
  return `tobuy_user_${userId}`;
}

export async function createFallbackToBuyItem({
  userId,
  name,
  quantity,
  location,
}) {
  let newItem;

  await updateFallbackStore((store) => {
    newItem = {
      id: store.counters.toBuyId++,
      userId: parseInt(userId),
      name,
      quantity: parseInt(quantity),
      location,
      createdAt: new Date().toISOString(),
    };

    store.toBuyItems.push(newItem);
    return store;
  });

  return newItem;
}

export async function getFallbackToBuyItems(userId) {
  const normalizedUserId = parseInt(userId);
  return (await readFallbackStore()).toBuyItems.filter(
    (item) => item.userId === normalizedUserId,
  );
}

export async function deleteFallbackToBuyItem(id) {
  let deletedItem = null;

  await updateFallbackStore((store) => {
    const index = store.toBuyItems.findIndex((item) => item.id === id);
    if (index === -1) {
      return store;
    }

    deletedItem = store.toBuyItems.splice(index, 1)[0];
    return store;
  });

  return deletedItem;
}
