/*
  Warnings:

  - Added the required column `newNft` to the `AlreadyMinted` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tx` to the `AlreadyMinted` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `AlreadyMinted` ADD COLUMN `newNft` VARCHAR(191) NOT NULL,
    ADD COLUMN `tx` VARCHAR(191) NOT NULL;
