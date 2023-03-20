import type {
  User,
  RunningWorkout,
  RunningWorkoutStep,
  Prisma,
} from "@prisma/client";
import { Status } from "@prisma/client";

import { prisma } from "~/db.server";

export function getInitialRunningWorkout({ userId }: { userId: User["id"] }) {
  return prisma.runningWorkout.findFirst({
    include: {
      steps: {
        orderBy: {
          orderIndex: "desc",
        },
      },
    },
    where: { userId, status: Status.Init },
  });
}
export function getRunningWorkout({
  id,
  userId,
}: Pick<RunningWorkout, "id"> & {
  userId: User["id"];
}) {
  return prisma.runningWorkout.findFirst({
    include: {
      steps: {
        orderBy: {
          orderIndex: "desc",
        },
      },
    },
    where: { id, userId },
  });
}

export function getRunningWorkoutListItems({ userId }: { userId: User["id"] }) {
  return prisma.runningWorkout.findMany({
    where: { userId },
    select: { id: true, title: true, durationUnix: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createRunningWorkout({
  userId,
  steps,
  ...runningWorkoutArgs
}: Prisma.RunningWorkoutUncheckedCreateInput & {
  steps: Omit<
    Prisma.RunningWorkoutStepUncheckedCreateInput,
    "runningWorkoutId" | "id"
  >[];
}) {
  return prisma.runningWorkout.create({
    data: {
      ...runningWorkoutArgs,
      user: {
        connect: {
          id: userId,
        },
      },
      steps: {
        createMany: {
          data: steps,
        },
      },
    },
  });
}

export function updateRunningWorkoutStep({
  id,
  ...runningWorkoutStepArgs
}: Omit<Prisma.RunningWorkoutStepUncheckedUpdateInput, "id"> & {
  id: string;
}) {
  return prisma.runningWorkoutStep.update({
    data: {
      ...runningWorkoutStepArgs,
    },
    where: {
      id,
    },
  });
}

export function updateRunningWorkout({
  userId,
  steps,
  id,
  ...runningWorkoutArgs
}: Omit<Prisma.RunningWorkoutUncheckedUpdateInput, "id" | "steps"> & {
  id: string;
  steps: Prisma.RunningWorkoutStepUncheckedUpdateManyWithoutStepsInput[];
}) {
  return prisma.runningWorkout.update({
    data: {
      ...runningWorkoutArgs,
      steps: {
        updateMany: { data: steps, where: { id: steps.id } },
      },
    },
    where: {
      id,
    },
  });
}

// export function deletePlan({
//   id,
//   userId,
// }: Pick<RunningWorkout, "id"> & { userId: User["id"] }) {
//   return prisma.plan.deleteMany({
//     where: { id, userId },
//   });
// }
