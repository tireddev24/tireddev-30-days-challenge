/*
  Warnings:

  - The primary key for the `followers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `followers` table. All the data in the column will be lost.
  - Made the column `followingId` on table `followers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `followerId` on table `followers` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "followers" DROP CONSTRAINT "followers_followerId_fkey";

-- DropForeignKey
ALTER TABLE "followers" DROP CONSTRAINT "followers_followingId_fkey";

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "firstname" DROP NOT NULL,
ALTER COLUMN "lastname" DROP NOT NULL;

-- AlterTable
ALTER TABLE "followers" DROP CONSTRAINT "followers_pkey",
DROP COLUMN "id",
ALTER COLUMN "followingId" SET NOT NULL,
ALTER COLUMN "followerId" SET NOT NULL,
ADD CONSTRAINT "followers_pkey" PRIMARY KEY ("followerId", "followingId");

-- AlterTable
ALTER TABLE "otp" ALTER COLUMN "expiryTime" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "followers" ADD CONSTRAINT "followers_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followers" ADD CONSTRAINT "followers_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
