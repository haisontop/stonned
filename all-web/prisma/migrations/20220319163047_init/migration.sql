-- CreateTable
CREATE TABLE `WhitelistUser` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `reserved` INTEGER NOT NULL,

    UNIQUE INDEX `WhitelistUser_address_key`(`address`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `username` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `profilePictureUrl` VARCHAR(191) NULL,
    `role` ENUM('NORMAL', 'AMBASSADOR', 'ANALYST', 'REVIEWER', 'CREATOR', 'TEAM', 'ADMIN') NOT NULL DEFAULT 'NORMAL',
    `twitterUrl` VARCHAR(191) NULL,
    `discordId` VARCHAR(191) NULL,
    `solanaAddress` VARCHAR(191) NOT NULL,
    `solanaBurnerAddress` VARCHAR(191) NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_solanaAddress_key`(`solanaAddress`),
    UNIQUE INDEX `User_solanaBurnerAddress_key`(`solanaBurnerAddress`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FeaturedProjectSpot` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `startAt` DATETIME(3) NOT NULL,
    `endArt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `candyMachineId` VARCHAR(191) NULL,
    `projectUrlIdentifier` VARCHAR(191) NOT NULL,
    `projectName` VARCHAR(191) NOT NULL,
    `projectDescription` VARCHAR(300) NOT NULL,
    `creatorName` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NULL,
    `mobileBannerUrl` VARCHAR(191) NOT NULL,
    `desktoBannerUrl` VARCHAR(191) NOT NULL,
    `profilePictureUrl` VARCHAR(191) NOT NULL,
    `logoUrl` VARCHAR(191) NULL,
    `totalSupply` INTEGER NULL,
    `isIncubator` BOOLEAN NULL,
    `isSuperCreator` BOOLEAN NULL,
    `publicMintStart` DATETIME(3) NOT NULL,
    `publicMintPrice` DOUBLE NOT NULL,
    `mintEnd` DATETIME(3) NULL,
    `reservedPublicSupply` INTEGER NOT NULL,
    `twitterUrl` VARCHAR(191) NULL,
    `instagramUrl` VARCHAR(191) NULL,
    `discordUrl` VARCHAR(191) NULL,
    `telegramUrl` VARCHAR(191) NULL,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `isDoxxed` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Project_projectUrlIdentifier_key`(`projectUrlIdentifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WhitelistPeriod` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `whitelistName` VARCHAR(191) NOT NULL,
    `whitelistDescription` VARCHAR(191) NULL,
    `startAt` DATETIME(3) NOT NULL,
    `endAt` DATETIME(3) NOT NULL,
    `supplyAvailable` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `maxPerWallet` INTEGER NOT NULL,
    `isWhitelist` BOOLEAN NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `totalPriceInSol` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WhitelistSpot` (
    `user` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `hasMinted` INTEGER NOT NULL DEFAULT 0,
    `whitelistPeriodId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`whitelistPeriodId`, `user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pricing` (
    `id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NULL,
    `amount` DOUBLE NULL,
    `amountInSol` DOUBLE NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'SOL',
    `isSol` BOOLEAN NOT NULL,
    `whitelistPeriodId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectUtility` (
    `id` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `headline` VARCHAR(191) NOT NULL,
    `description` VARCHAR(300) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectRoadmapPeriod` (
    `id` VARCHAR(191) NOT NULL,
    `periodName` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectRoadmapItem` (
    `id` VARCHAR(191) NOT NULL,
    `headline` VARCHAR(191) NOT NULL,
    `description` VARCHAR(300) NOT NULL,
    `roadmapPeriodId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectTeamMember` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `twitterUrl` VARCHAR(191) NULL,
    `memberName` VARCHAR(191) NULL,
    `description` VARCHAR(300) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectReview` (
    `id` VARCHAR(191) NOT NULL,
    `reviewer` VARCHAR(191) NOT NULL,
    `review` VARCHAR(300) NOT NULL,
    `score` INTEGER NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vote` (
    `isUpvote` BOOLEAN NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Vote_userId_projectId_key`(`userId`, `projectId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment` (
    `id` VARCHAR(191) NOT NULL,
    `message` VARCHAR(200) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Favorite` (
    `projectId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Favorite_userId_projectId_key`(`userId`, `projectId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
