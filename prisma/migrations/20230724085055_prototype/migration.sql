/*
  Warnings:

  - The primary key for the `authme` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `authme` table. The data in that column could be lost. The data in that column will be cast from `UnsignedMediumInt` to `UnsignedInt`.
  - You are about to alter the column `username` on the `authme` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Char(16)`.
  - You are about to alter the column `realname` on the `authme` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Char(16)`.
  - You are about to alter the column `password` on the `authme` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `lastlogin` on the `authme` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `UnsignedBigInt`.
  - You are about to alter the column `world` on the `authme` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Char(16)`.
  - You are about to alter the column `regdate` on the `authme` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `UnsignedBigInt`.
  - You are about to alter the column `regip` on the `authme` table. The data in that column could be lost. The data in that column will be cast from `VarChar(40)` to `Char(39)`.
  - You are about to alter the column `isLogged` on the `authme` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `TinyInt`.
  - You are about to alter the column `hasSession` on the `authme` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `authme` DROP PRIMARY KEY,
    MODIFY `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    MODIFY `username` CHAR(16) NOT NULL,
    MODIFY `realname` CHAR(16) NOT NULL,
    MODIFY `password` VARCHAR(191) NOT NULL DEFAULT 'no',
    MODIFY `ip` VARCHAR(191) NULL,
    MODIFY `lastlogin` BIGINT UNSIGNED NULL,
    MODIFY `x` DOUBLE NULL,
    MODIFY `y` DOUBLE NULL,
    MODIFY `z` DOUBLE NULL,
    MODIFY `world` CHAR(16) NOT NULL DEFAULT 'l',
    MODIFY `regdate` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    MODIFY `regip` CHAR(39) NULL DEFAULT '::1',
    MODIFY `yaw` DOUBLE NULL DEFAULT 0,
    MODIFY `pitch` DOUBLE NULL DEFAULT 0,
    MODIFY `isLogged` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `hasSession` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `uuid` CHAR(36) NULL,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `Profile` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `cid` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `Profile_cid_key`(`cid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_cid_fkey` FOREIGN KEY (`cid`) REFERENCES `authme`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RedefineIndex
CREATE UNIQUE INDEX `authme_username_key` ON `authme`(`username`);
DROP INDEX `username` ON `authme`;
