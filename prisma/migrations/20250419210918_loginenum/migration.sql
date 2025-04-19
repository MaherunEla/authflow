/*
  Warnings:

  - Changed the type of `success` on the `LoginAttempt` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "LoginStatus" AS ENUM ('SUCCESS', 'FAILURE');

-- AlterTable
ALTER TABLE "LoginAttempt" DROP COLUMN "success",
ADD COLUMN     "success" "LoginStatus" NOT NULL,
ALTER COLUMN "location" DROP NOT NULL,
ALTER COLUMN "userAgent" DROP NOT NULL;
