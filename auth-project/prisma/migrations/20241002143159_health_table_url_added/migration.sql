/*
  Warnings:

  - Added the required column `url` to the `Health` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Health" ADD COLUMN     "url" TEXT NOT NULL;
