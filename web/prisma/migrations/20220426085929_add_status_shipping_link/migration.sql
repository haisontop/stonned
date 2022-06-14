-- AlterTable
ALTER TABLE `CbdOrder` ADD COLUMN `shippingLink` VARCHAR(191) NULL,
    ADD COLUMN `status` ENUM('Confirmed', 'Shipped') NOT NULL DEFAULT 'Confirmed';
