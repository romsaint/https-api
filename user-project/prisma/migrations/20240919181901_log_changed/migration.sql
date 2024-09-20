/*
  Warnings:

  - The primary key for the `Log` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `data_log` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `log_id` on the `Log` table. All the data in the column will be lost.
  - Added the required column `level` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Log" DROP CONSTRAINT "Log_pkey",
DROP COLUMN "created_at",
DROP COLUMN "data_log",
DROP COLUMN "log_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "level" TEXT NOT NULL,
ADD COLUMN     "message" TEXT NOT NULL,
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "Log_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profile_image" TEXT;
