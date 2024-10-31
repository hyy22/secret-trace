-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Hash" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hash" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Hash" ("hash", "id", "used") SELECT "hash", "id", "used" FROM "Hash";
DROP TABLE "Hash";
ALTER TABLE "new_Hash" RENAME TO "Hash";
CREATE UNIQUE INDEX "Hash_hash_key" ON "Hash"("hash");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
