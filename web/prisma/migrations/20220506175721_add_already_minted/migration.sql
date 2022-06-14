-- CreateTable
CREATE TABLE `AlreadyMinted` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nft` VARCHAR(191) NOT NULL,
    `user` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `AlreadyMinted_nft_key`(`nft`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
