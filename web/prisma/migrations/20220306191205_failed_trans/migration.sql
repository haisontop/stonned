/*
  Warnings:

  - Added the required column `updatedAt` to the `BoxUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `BoxUser` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `FailedBoxOrder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `wallet` VARCHAR(191) NOT NULL,
    `tx` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `FailedBoxOrder_wallet_key`(`wallet`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
