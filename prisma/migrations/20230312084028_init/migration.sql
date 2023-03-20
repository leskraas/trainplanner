/*
  Warnings:

  - Added the required column `durationType` to the `RunningWorkoutStep` table without a default value. This is not possible if the table is not empty.
  - Added the required column `durationValue` to the `RunningWorkoutStep` table without a default value. This is not possible if the table is not empty.
  - Made the column `runningWorkoutId` on table `RunningWorkoutStep` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "IntensityTargetType" AS ENUM ('Pace', 'HeartRateZone');

-- CreateEnum
CREATE TYPE "DurationType" AS ENUM ('TimeUnixSeconds', 'DistanceMeters');

-- AlterTable
ALTER TABLE "RunningWorkoutStep" ADD COLUMN     "durationType" "DurationType" NOT NULL,
ADD COLUMN     "durationValue" INTEGER NOT NULL,
ADD COLUMN     "intensityTargetType" "IntensityTargetType",
ADD COLUMN     "intensityTargetValue" INTEGER,
ALTER COLUMN "runningWorkoutId" SET NOT NULL;
