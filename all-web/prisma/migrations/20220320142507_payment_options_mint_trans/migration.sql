-- AlterTable
ALTER TABLE `Pricing` ADD COLUMN `paymentOptionId` VARCHAR(191) NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE `MintTransaction` (
    `id` VARCHAR(191) NOT NULL,
    `tx` VARCHAR(191) NULL,
    `user` VARCHAR(191) NOT NULL,
    `confirmed` BOOLEAN NOT NULL DEFAULT false,
    `pricingId` VARCHAR(191) NOT NULL,
    `mintPeriodId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentOption` (
    `id` VARCHAR(191) NOT NULL,
    `maxMintPercentage` DOUBLE NOT NULL,
    `mintingPeriodId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
