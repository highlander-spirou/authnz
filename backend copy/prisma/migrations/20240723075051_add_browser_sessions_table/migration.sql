-- CreateTable
CREATE TABLE `BrowserSessions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_agent` VARCHAR(191) NOT NULL,
    `browser_token` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `last_activity` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `BrowserSessions_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BrowserSessions` ADD CONSTRAINT `BrowserSessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
