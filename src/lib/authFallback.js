import bcrypt from "bcryptjs";
import { readFallbackStore, updateFallbackStore } from "@/lib/fallbackStore";

function normalizeUsername(username) {
  return username?.trim().toLowerCase();
}

export async function getFallbackUserByUsername(username) {
  const normalizedUsername = normalizeUsername(username);
  const store = await readFallbackStore();
  return (
    store.users.find((user) => user.username === normalizedUsername) || null
  );
}

export async function createFallbackUser({
  username,
  password,
  firstName,
  lastName,
}) {
  const normalizedUsername = normalizeUsername(username);
  const existingUser = await getFallbackUserByUsername(normalizedUsername);

  if (existingUser) {
    return {
      id: existingUser.id,
      username: existingUser.username,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  let createdUser;

  await updateFallbackStore((store) => {
    const id = store.counters.userId++;
    createdUser = {
      id,
      username: normalizedUsername,
      password: hashedPassword,
      firstName,
      lastName,
    };

    store.users.push(createdUser);
    return store;
  });

  return {
    id: createdUser.id,
    username: normalizedUsername,
    firstName,
    lastName,
  };
}

export async function verifyFallbackUser(username, password) {
  const normalizedUsername = normalizeUsername(username);
  const store = await readFallbackStore();
  const user = store.users.find(
    (entry) => entry.username === normalizedUsername,
  );

  if (!user) {
    return null;
  }

  const matches = await bcrypt.compare(password, user.password);
  if (!matches) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
  };
}
