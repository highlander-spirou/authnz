-- CreateTable
CREATE TABLE `MfaVerifyStatus` (
    `id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `verified_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `MfaVerifyStatus_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
