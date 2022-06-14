-- AlterTable
ALTER TABLE `User` ADD COLUMN `notifyMintStart` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `notifyNewProject` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `notifyNewWhitelist` BOOLEAN NOT NULL DEFAULT true;
