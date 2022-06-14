-- CreateTable
CREATE TABLE `TransactionCheck` (
    `id` VARCHAR(191) NOT NULL,
    `transaction` VARCHAR(2000) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
