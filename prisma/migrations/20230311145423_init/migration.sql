/*
  Warnings:

  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RunningStepType" AS ENUM ('WarmUp', 'Run', 'Rest', 'CoolDown', 'Other');

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Note";

-- CreateTable
CREATE TABLE "PlannedRunningWorkout" (
    "id" TEXT NOT NULL,
    "schedule" TIMESTAMP(3) NOT NULL,
    "workoutId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PlannedRunningWorkout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RunningWorkout" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Løpeøkt',
    "private" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "durationUnix" INTEGER,

    CONSTRAINT "RunningWorkout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RunningWorkoutStep" (
    "id" TEXT NOT NULL,
    "runningWorkoutId" TEXT,
    "type" "RunningStepType" NOT NULL,

    CONSTRAINT "RunningWorkoutStep_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlannedRunningWorkout" ADD CONSTRAINT "PlannedRunningWorkout_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "RunningWorkout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannedRunningWorkout" ADD CONSTRAINT "PlannedRunningWorkout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunningWorkout" ADD CONSTRAINT "RunningWorkout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunningWorkoutStep" ADD CONSTRAINT "RunningWorkoutStep_runningWorkoutId_fkey" FOREIGN KEY ("runningWorkoutId") REFERENCES "RunningWorkout"("id") ON DELETE CASCADE ON UPDATE CASCADE;
