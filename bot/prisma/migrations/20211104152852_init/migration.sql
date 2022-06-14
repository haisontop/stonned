/*
  Warnings:

  - You are about to drop the column `discordId` on the `MintAccess` table. All the data in the column will be lost.
  - Added the required column `userId` to the `MintAccess` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `MintAccess` DROP COLUMN `discordId`,
    ADD COLUMN `userId` INTEGER NOT NULL;
