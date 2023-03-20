import dayjs from "dayjs";
import type { Prisma } from "@prisma/client";
import { DurationType, RunningStepType } from "@prisma/client";
export function typedBoolean<T>(
  value: T
): value is Exclude<T, false | null | undefined | "" | 0> {
  return Boolean(value);
}

export function formattedRunningWorkoutStepType(stepType: RunningStepType) {
  if (stepType === RunningStepType.WarmUp) {
    return "Oppvarming";
  }
  if (stepType === RunningStepType.CoolDown) {
    return "Nedvarming";
  }
  if (stepType === RunningStepType.Run) {
    return "Løp";
  }
  if (stepType === RunningStepType.Rest) {
    return "Hvile";
  }
  if (stepType === RunningStepType.Other) {
    return "Annet";
  }
  return "";
}
export function formattedDurationType(durationType: DurationType) {
  if (durationType === DurationType.DistanceMeters) {
    return "Avstand";
  }
  if (durationType === DurationType.TimeUnixSeconds) {
    return "Tid";
  }
  return "";
}

type FormattedDuration = Pick<
  Prisma.RunningWorkoutStepCreateInput,
  "durationType" | "durationValue"
>;

export function formattedMeterDistanceToNearestUnit(
  durationValue: Prisma.RunningWorkoutStepCreateInput["durationValue"]
) {
  const distanceInKm = durationValue / 1000;
  if (distanceInKm >= 1) {
    return `${distanceInKm.toFixed(2)} km`.replace(".", ",");
  }
  return `${durationValue} m`;
}

export function formattedTime(
  durationValue: Prisma.RunningWorkoutStepCreateInput["durationValue"]
) {
  const duration = dayjs.duration(durationValue, "seconds");
  const hours = duration.format("HH");
  const minutes = duration.format("mm");
  const seconds = duration.format("ss");

  if (hours !== "00") {
    return `${hours}:${minutes}:${seconds}`;
  }
  if (minutes !== "00") {
    return `${minutes}:${seconds}`;
  }
  return `${seconds}s`;
}

export function formattedDuration({
  durationType,
  durationValue,
}: FormattedDuration) {
  if (durationType === DurationType.DistanceMeters) {
    return formattedMeterDistanceToNearestUnit(durationValue);
  }
  if (durationType === DurationType.TimeUnixSeconds) {
    return formattedTime(durationValue);
  }
  return "";
}
