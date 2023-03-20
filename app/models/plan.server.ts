import type { User, Plan } from "@prisma/client";

import { prisma } from "~/db.server";

export function getPlan({
  id,
  userId,
}: Pick<Plan, "id"> & {
  userId: User["id"];
}) {
  return prisma.plan.findFirst({
    select: {
      id: true,
      planRunningWorkouts: { select: { workout: true, schedule: true } },
      title: true,
    },
    where: { id, userId },
  });
}

export function getPlanListItems({ userId }: { userId: User["id"] }) {
  return prisma.plan.findMany({
    where: { userId },
    select: { id: true, title: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createPlan({
  title,
  userId,
  planRunningWorkoutIds,
}: Pick<Plan, "title"> & {
  userId: User["id"];
  planRunningWorkoutIds?: string[];
}) {
  return prisma.plan.create({
    data: {
      title,
      user: {
        connect: {
          id: userId,
        },
      },
      planRunningWorkouts: {
        connect:
          planRunningWorkoutIds?.map((workoutId) => ({ id: workoutId })) || [],
      },
    },
  });
}

export function deletePlan({
  id,
  userId,
}: Pick<Plan, "id"> & { userId: User["id"] }) {
  return prisma.plan.deleteMany({
    where: { id, userId },
  });
}
