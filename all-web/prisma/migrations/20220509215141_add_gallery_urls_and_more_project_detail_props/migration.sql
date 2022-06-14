-- AlterTable
ALTER TABLE `Project` ADD COLUMN `headerType` ENUM('GALLERY', 'BANNER') NOT NULL DEFAULT 'GALLERY',
    ADD COLUMN `promoVideo` VARCHAR(191) NULL,
    ADD COLUMN `websiteUrl` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `ProjectTeamMember` ADD COLUMN `linkedInUrl` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `GalleryUrl` (
    `id` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `usedForHeader` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
