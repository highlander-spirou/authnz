-- AlterTable
ALTER TABLE `MfaVerifyStatus` ADD COLUMN `uuid_ttl` DATETIME(3) NULL,
    MODIFY `uuid` VARCHAR(191) NULL;
