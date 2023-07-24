-- CreateTable
CREATE TABLE `authme` (
    `id` MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `realname` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `ip` VARCHAR(40) NULL,
    `lastlogin` BIGINT NULL,
    `x` DOUBLE NOT NULL DEFAULT 0,
    `y` DOUBLE NOT NULL DEFAULT 0,
    `z` DOUBLE NOT NULL DEFAULT 0,
    `world` VARCHAR(255) NOT NULL DEFAULT 'world',
    `regdate` BIGINT NOT NULL DEFAULT 0,
    `regip` VARCHAR(40) NULL,
    `yaw` FLOAT NULL,
    `pitch` FLOAT NULL,
    `email` VARCHAR(255) NULL,
    `isLogged` SMALLINT NOT NULL DEFAULT 0,
    `hasSession` SMALLINT NOT NULL DEFAULT 0,
    `totp` VARCHAR(32) NULL,
    `uuid` VARCHAR(36) NULL,

    UNIQUE INDEX `username`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

