/*
  Warnings:

  - You are about to drop the column `jurusan` on the `user` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "school_major" AS ENUM ('ips', 'ipa');

-- AlterTable
ALTER TABLE "user" DROP COLUMN "jurusan",
ADD COLUMN     "major" "school_major";

-- DropEnum
DROP TYPE "jurusan_sekolah";

-- CreateTable
CREATE TABLE "material" (
    "id" UUID NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "material_pkey" PRIMARY KEY ("id")
);
