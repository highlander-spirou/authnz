/*
  Warnings:

  - Made the column `retries` on table `EmailVerification` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `EmailVerification` MODIFY `retries` INTEGER NOT NULL;
