-- AlterTable
ALTER TABLE `Project` MODIFY `projectDescription` VARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE `ProjectReview` MODIFY `review` VARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE `ProjectTeamMember` MODIFY `description` VARCHAR(500) NULL;

-- AlterTable
ALTER TABLE `ProjectUtility` MODIFY `description` VARCHAR(500) NOT NULL;
