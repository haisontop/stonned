-- CreateTable
CREATE TABLE `Banlist` (
    `mintAddress` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Banlist_mintAddress_key`(`mintAddress`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
