-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ToBuyItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "ToBuyItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ToBuyItem" ("expiresAt", "id", "location", "name", "quantity", "userId") SELECT "expiresAt", "id", "location", "name", "quantity", "userId" FROM "ToBuyItem";
DROP TABLE "ToBuyItem";
ALTER TABLE "new_ToBuyItem" RENAME TO "ToBuyItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
