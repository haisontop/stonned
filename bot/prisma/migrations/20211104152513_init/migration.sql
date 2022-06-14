/*
  Warnings:

  - A unique constraint covering the columns `[twitterUserId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `twitterUserId` VARCHAR(191),
    ADD COLUMN `twitterUsername` VARCHAR(191);

-- CreateTable
CREATE TABLE `Mint` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,
    `amount` DECIMAL(65, 30) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_twitterUserId_key` ON `User`(`twitterUserId`);
