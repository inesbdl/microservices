/*
  Warnings:

  - You are about to drop the column `commentId` on the `comment` table. All the data in the column will be lost.
  - You are about to alter the column `artwork` on the `comment` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user" TEXT NOT NULL,
    "artwork" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "parentId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "comment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_comment" ("artwork", "content", "createdAt", "id", "user") SELECT "artwork", "content", "createdAt", "id", "user" FROM "comment";
DROP TABLE "comment";
ALTER TABLE "new_comment" RENAME TO "comment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
