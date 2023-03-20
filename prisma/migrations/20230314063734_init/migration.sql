/*
  Warnings:

  - Added the required column `status` to the `RunningWorkout` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Init', 'Finsihed', 'Delete');

-- AlterTable
ALTER TABLE "RunningWorkout" ADD COLUMN     "status" "Status" NOT NULL;
