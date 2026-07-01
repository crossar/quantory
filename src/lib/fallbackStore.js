import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const fallbackDataDir = path.join(process.cwd(), ".quantory");
const fallbackDataFile = path.join(fallbackDataDir, "fallback-data.json");

function createDefaultStore() {
  return {
    counters: {
      userId: 1000,
      itemId: 1000,
      toBuyId: 2000,
    },
    users: [],
    items: [],
    toBuyItems: [],
  };
}

async function ensureStoreFile() {
  await mkdir(fallbackDataDir, { recursive: true });

  try {
    await readFile(fallbackDataFile, "utf8");
  } catch {
    await writeFile(
      fallbackDataFile,
      JSON.stringify(createDefaultStore(), null, 2),
      "utf8",
    );
  }
}

export async function readFallbackStore() {
  await ensureStoreFile();

  try {
    const raw = await readFile(fallbackDataFile, "utf8");
    const parsed = JSON.parse(raw);

    return {
      ...createDefaultStore(),
      ...parsed,
      counters: {
        ...createDefaultStore().counters,
        ...(parsed.counters || {}),
      },
      users: parsed.users || [],
      items: parsed.items || [],
      toBuyItems: parsed.toBuyItems || [],
    };
  } catch {
    const initialStore = createDefaultStore();
    await writeFallbackStore(initialStore);
    return initialStore;
  }
}

export async function writeFallbackStore(store) {
  await ensureStoreFile();
  await writeFile(fallbackDataFile, JSON.stringify(store, null, 2), "utf8");
}

export async function updateFallbackStore(updater) {
  const store = await readFallbackStore();
  const nextStore = (await updater(store)) || store;
  await writeFallbackStore(nextStore);
  return nextStore;
}
