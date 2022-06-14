-- CreateTable
CREATE TABLE `TokenMetadata` (
    `id` VARCHAR(191) NOT NULL,
    `mint` VARCHAR(191) NOT NULL,
    `data` VARCHAR(2000) NOT NULL,

    UNIQUE INDEX `TokenMetadata_mint_key`(`mint`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
