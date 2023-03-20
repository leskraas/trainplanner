import { DurationType, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user
    .delete({
      where: {
        email,
      },
    })
    .catch((e) => {
      // no worries if it doesn't exist yet
      console.log("error", e);
    });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const runningWorkout = await prisma.runningWorkout.create({
    data: {
      title: "Første økt",
      user: {
        connect: {
          id: user.id,
        },
      },
      status: "Init",
      steps: {
        createMany: {
          data: [
            {
              type: "WarmUp",
              durationType: DurationType.DistanceMeters,
              orderIndex: 1,
              durationValue: 2000,
            },
            {
              type: "Run",
              durationType: DurationType.TimeUnixSeconds,
              orderIndex: 2,
              durationValue: 200,
            },
            {
              type: "CoolDown",
              durationType: DurationType.DistanceMeters,
              orderIndex: 3,
              durationValue: 1000,
            },
          ],
        },
      },
    },
  });

  const schedule = new Date("2023-05-01");
  await prisma.plannedRunningWorkout.create({
    data: {
      workout: {
        connect: {
          id: runningWorkout.id,
        },
      },
      schedule,
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
