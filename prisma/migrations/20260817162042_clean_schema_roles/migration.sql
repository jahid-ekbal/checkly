/*
  Warnings:

  - You are about to drop the column `username` on the `user` table. All the data in the column will be lost.

*/
-- Normalize roles to admin/user before the table rebuild
UPDATE "user" SET "role" = 'admin' WHERE "role" = 'owner';
UPDATE "user" SET "role" = 'user' WHERE "role" IN ('member', 'viewer') OR "role" IS NULL;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "banner" TEXT,
    "bio" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "banned" BOOLEAN DEFAULT false,
    "banReason" TEXT,
    "banExpires" DATETIME,
    "workspaceId" TEXT NOT NULL DEFAULT 'default',
    CONSTRAINT "user_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspace" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_user" ("banExpires", "banReason", "banned", "banner", "bio", "createdAt", "email", "emailVerified", "id", "image", "name", "role", "updatedAt", "workspaceId") SELECT "banExpires", "banReason", "banned", "banner", "bio", "createdAt", "email", "emailVerified", "id", "image", "name", coalesce("role", 'user') AS "role", "updatedAt", "workspaceId" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
CREATE INDEX "user_workspaceId_idx" ON "user"("workspaceId");
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
