-- CreateTable
CREATE TABLE `MintCreator` (
    `mint` VARCHAR(191) NOT NULL,
    `creator` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`mint`, `creator`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
