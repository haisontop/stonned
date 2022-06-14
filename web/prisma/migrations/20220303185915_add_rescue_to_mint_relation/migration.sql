-- AlterTable
ALTER TABLE `RescueMintError` ADD COLUMN `rescuePubKey` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `resolved` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `revealTx` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `RescueToMint` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `user` VARCHAR(191) NOT NULL,
    `rescuePubKey` VARCHAR(191) NOT NULL,
    `mint` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `RescueToMint_rescuePubKey_key`(`rescuePubKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
