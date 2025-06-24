-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ToBuyItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL DEFAULT 'unspecified',
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "expiresAt" DATETIME
);
INSERT INTO "new_ToBuyItem" ("id", "location", "name") SELECT "id", "location", "name" FROM "ToBuyItem";
DROP TABLE "ToBuyItem";
ALTER TABLE "new_ToBuyItem" RENAME TO "ToBuyItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
