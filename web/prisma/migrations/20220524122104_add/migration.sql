-- CreateTable
CREATE TABLE `AwakeningMeta` (
    `id` INTEGER NOT NULL,
    `nft` VARCHAR(191) NOT NULL,
    `nftName` VARCHAR(191) NOT NULL,
    `newMetadataLink` VARCHAR(191) NOT NULL,
    `newMetadata` VARCHAR(191) NOT NULL,
    `creator` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`, `creator`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AwakeningUpdateModel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nft` VARCHAR(191) NOT NULL,
    `nftName` VARCHAR(191) NOT NULL,
    `newMetadata` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `AwakeningUpdateModel_nft_key`(`nft`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
