/*
  Warnings:

  - You are about to drop the column `verified_at` on the `MfaVerifyStatus` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `MfaVerifyStatus` DROP COLUMN `verified_at`;
