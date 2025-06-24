/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ToBuyItem` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ToBuyItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);
INSERT INTO "new_ToBuyItem" ("id", "name") SELECT "id", "name" FROM "ToBuyItem";
DROP TABLE "ToBuyItem";
ALTER TABLE "new_ToBuyItem" RENAME TO "ToBuyItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
