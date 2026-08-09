/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN "banner" TEXT;
ALTER TABLE "user" ADD COLUMN "bio" TEXT;
ALTER TABLE "user" ADD COLUMN "username" TEXT;

-- CreateTable
CREATE TABLE "task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" DATETIME,
    "dueDate" DATETIME,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "effortHours" REAL,
    "image" TEXT,
    "createdById" TEXT NOT NULL,
    "assigneeId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "task_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "task_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "label" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#6366f1',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "task_label" (
    "taskId" TEXT NOT NULL,
    "labelId" TEXT NOT NULL,

    PRIMARY KEY ("taskId", "labelId"),
    CONSTRAINT "task_label_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "task" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "task_label_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "label" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "task_activity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "task_activity_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "task" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "task_activity_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "task_assigneeId_idx" ON "task"("assigneeId");

-- CreateIndex
CREATE INDEX "task_createdById_idx" ON "task"("createdById");

-- CreateIndex
CREATE INDEX "task_activity_taskId_idx" ON "task_activity"("taskId");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");
