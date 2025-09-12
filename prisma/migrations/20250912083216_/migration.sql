-- CreateTable
CREATE TABLE `supervisors` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `nationalId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `supervisors_email_key`(`email`),
    UNIQUE INDEX `supervisors_nationalId_key`(`nationalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `students` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(191) NOT NULL,
    `sex` VARCHAR(191) NOT NULL,
    `candidateNo` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `schoolName` VARCHAR(191) NOT NULL,
    `className` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL DEFAULT '',
    `districtId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `students_candidateNo_key`(`candidateNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assessments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `assessmentDate` DATETIME(3) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `topic` VARCHAR(191) NOT NULL,
    `preparationMark` INTEGER NOT NULL DEFAULT 0,
    `preparationComment` VARCHAR(191) NOT NULL,
    `lessonPlanningMark` INTEGER NOT NULL DEFAULT 0,
    `lessonPlanningComment` VARCHAR(191) NOT NULL,
    `environmentMark` INTEGER NOT NULL DEFAULT 0,
    `environmentComment` VARCHAR(191) NOT NULL,
    `documentsMark` INTEGER NOT NULL DEFAULT 0,
    `documentsComment` VARCHAR(191) NOT NULL,
    `introductionMark` INTEGER NOT NULL DEFAULT 0,
    `introductionComment` VARCHAR(191) NOT NULL,
    `developmentMark` INTEGER NOT NULL DEFAULT 0,
    `developmentComment` VARCHAR(191) NOT NULL,
    `conclusionMark` INTEGER NOT NULL DEFAULT 0,
    `conclusionComment` VARCHAR(191) NOT NULL,
    `personalDimensionsMark` INTEGER NOT NULL DEFAULT 0,
    `personalDimensionsComment` VARCHAR(191) NOT NULL DEFAULT '',
    `communityMark` INTEGER NOT NULL DEFAULT 0,
    `communityComment` VARCHAR(191) NOT NULL DEFAULT '',
    `formType` VARCHAR(191) NOT NULL DEFAULT 'junior',
    `overallComment` VARCHAR(191) NOT NULL,
    `supervisorId` INTEGER NOT NULL,
    `studentId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `districts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `districts_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin_users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'admin',
    `assignedDistrictId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `admin_users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `system_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `value` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `system_settings_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_districtId_fkey` FOREIGN KEY (`districtId`) REFERENCES `districts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assessments` ADD CONSTRAINT `assessments_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `supervisors`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assessments` ADD CONSTRAINT `assessments_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admin_users` ADD CONSTRAINT `admin_users_assignedDistrictId_fkey` FOREIGN KEY (`assignedDistrictId`) REFERENCES `districts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
