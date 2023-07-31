/*
  Warnings:

  - Added the required column `title` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Made the column `x` on table `authme` required. This step will fail if there are existing NULL values in that column.
  - Made the column `y` on table `authme` required. This step will fail if there are existing NULL values in that column.
  - Made the column `z` on table `authme` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Profile` ADD COLUMN `title` VARCHAR(64) NOT NULL;

-- AlterTable
ALTER TABLE `authme` MODIFY `x` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `y` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `z` DOUBLE NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `Donation` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `profileId` INTEGER UNSIGNED NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BadgeOwnership` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `pfid` INTEGER UNSIGNED NOT NULL,
    `since` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `bid` TINYINT UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Badge` (
    `id` TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` CHAR(16) NOT NULL,
    `url` VARCHAR(512) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Donation` ADD CONSTRAINT `Donation_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `Profile`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BadgeOwnership` ADD CONSTRAINT `BadgeOwnership_pfid_fkey` FOREIGN KEY (`pfid`) REFERENCES `Profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BadgeOwnership` ADD CONSTRAINT `BadgeOwnership_bid_fkey` FOREIGN KEY (`bid`) REFERENCES `Badge`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
