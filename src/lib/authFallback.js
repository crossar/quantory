import bcrypt from "bcryptjs";

const fallbackUsers = (globalThis.__homeventoryFallbackUsers ??= new Map());
const userIdMap = (globalThis.__homeventoryUserIds ??= new Map());

let nextUserId = 1000;

function normalizeUsername(username) {
  return username?.trim().toLowerCase();
}

function getUserIdForUsername(username) {
  const normalized = normalizeUsername(username);
  if (!userIdMap.has(normalized)) {
    userIdMap.set(normalized, nextUserId++);
  }
  return userIdMap.get(normalized);
}

export async function createFallbackUser({
  username,
  password,
  firstName,
  lastName,
}) {
  const normalizedUsername = normalizeUsername(username);
  const hashedPassword = await bcrypt.hash(password, 10);
  const id = getUserIdForUsername(normalizedUsername);

  fallbackUsers.set(normalizedUsername, {
    id,
    username: normalizedUsername,
    password: hashedPassword,
    firstName,
    lastName,
  });

  return {
    id,
    username: normalizedUsername,
    firstName,
    lastName,
  };
}

export async function verifyFallbackUser(username, password) {
  const normalizedUsername = normalizeUsername(username);
  const user = fallbackUsers.get(normalizedUsername);

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
