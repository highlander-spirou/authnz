/*
  Warnings:

  - You are about to drop the column `last_activity` on the `BrowserSessions` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `BrowserSessions` table. All the data in the column will be lost.
  - Added the required column `last_login` to the `BrowserSessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session_token` to the `BrowserSessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `BrowserSessions` DROP COLUMN `last_activity`,
    DROP COLUMN `token`,
    ADD COLUMN `last_login` INTEGER NOT NULL,
    ADD COLUMN `session_token` VARCHAR(191) NOT NULL;
