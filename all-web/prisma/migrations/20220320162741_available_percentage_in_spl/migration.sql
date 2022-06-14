-- AlterTable
ALTER TABLE `PaymentOption` MODIFY `maxMintPercentage` DOUBLE NULL;

-- AlterTable
ALTER TABLE `Project` ADD COLUMN `availablePercentageInSpl` DOUBLE NULL;
