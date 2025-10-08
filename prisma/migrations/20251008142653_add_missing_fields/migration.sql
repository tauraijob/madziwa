-- AlterTable
ALTER TABLE `assessments` ADD COLUMN `selectedResearchCategory` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `supervisors` ADD COLUMN `districtId` INTEGER NULL,
    ADD COLUMN `passwordHash` VARCHAR(191) NULL,
    ADD COLUMN `pinHash` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `supervisors` ADD CONSTRAINT `supervisors_districtId_fkey` FOREIGN KEY (`districtId`) REFERENCES `districts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
