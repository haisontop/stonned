/*
  Warnings:

  - You are about to drop the column `pricingId` on the `MintTransaction` table. All the data in the column will be lost.
  - Added the required column `paymentOptionId` to the `MintTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `MintTransaction` DROP COLUMN `pricingId`,
    ADD COLUMN `paymentOptionId` VARCHAR(191) NOT NULL;
