-- CreateTable
CREATE TABLE `AwakeningBotModel` (
    `id` INTEGER NOT NULL,
    `nft` VARCHAR(191) NOT NULL,
    `nftName` VARCHAR(191) NOT NULL,
    `creator` VARCHAR(191) NOT NULL,
    `newMP4Link` VARCHAR(191) NOT NULL,
    `hasBeenPosted` BOOLEAN NOT NULL DEFAULT false,
    `hasBeenUpdated` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`, `creator`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
