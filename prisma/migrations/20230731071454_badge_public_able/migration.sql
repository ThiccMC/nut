-- AlterTable
ALTER TABLE `Badge` ADD COLUMN `cnohidn` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `BadgeOwnership` ADD COLUMN `public` BOOLEAN NOT NULL DEFAULT true;
