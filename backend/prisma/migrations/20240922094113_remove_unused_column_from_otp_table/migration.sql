/*
  Warnings:

  - You are about to drop the column `otp_ascii` on the `Otp` table. All the data in the column will be lost.
  - You are about to drop the column `otp_hex` on the `Otp` table. All the data in the column will be lost.
  - You are about to drop the column `otp_verified` on the `Otp` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Otp` DROP COLUMN `otp_ascii`,
    DROP COLUMN `otp_hex`,
    DROP COLUMN `otp_verified`;
