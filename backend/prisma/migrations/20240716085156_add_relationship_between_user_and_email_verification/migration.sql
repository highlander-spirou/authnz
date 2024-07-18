/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `EmailVerification` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `EmailVerification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `EmailVerification` ADD COLUMN `userId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `EmailVerification_userId_key` ON `EmailVerification`(`userId`);

-- AddForeignKey
ALTER TABLE `EmailVerification` ADD CONSTRAINT `EmailVerification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
