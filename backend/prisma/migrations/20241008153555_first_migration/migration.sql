-- CreateTable
CREATE TABLE `UserBasicCred` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `UserBasicCred_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserInfo` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(191) NULL,
    `activated` DATETIME(3) NULL,
    `tier` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoginSession` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `refresh_token` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `browser_info` VARCHAR(191) NOT NULL,
    `geolocation` VARCHAR(191) NULL,
    `latest_activity` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expired` DATETIME(3) NOT NULL,

    UNIQUE INDEX `LoginSession_refresh_token_key`(`refresh_token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Otp` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `otp_enabled` BOOLEAN NOT NULL DEFAULT false,
    `otp_base32` VARCHAR(191) NULL,

    UNIQUE INDEX `Otp_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Biometric` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `current_challenge` VARCHAR(191) NULL,
    `authenticator` JSON NULL,

    UNIQUE INDEX `Biometric_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Team` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `owner_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeamMember` (
    `user_id` INTEGER NOT NULL,
    `team_id` INTEGER NOT NULL,
    `role` ENUM('ADMIN', 'EDITOR', 'USER') NOT NULL DEFAULT 'USER',

    PRIMARY KEY (`user_id`, `team_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
