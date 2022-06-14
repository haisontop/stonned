/*
  Warnings:

  - You are about to drop the column `user` on the `MintTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Project` table. All the data in the column will be lost.
  - Added the required column `userId` to the `MintTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `MintTransaction` DROP COLUMN `user`,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Project` DROP COLUMN `userId`,
    ADD COLUMN `creatorId` VARCHAR(191) NULL;
