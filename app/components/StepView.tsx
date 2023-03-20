import { ChevronRightIcon } from "@heroicons/react/24/outline";
import type { Prisma } from "@prisma/client";
import { useRef, useState } from "react";
import { useZorm } from "react-zorm";
import { RunningWorkoutStepSchema } from "~/routes/workouts.new";
import {
  formattedDuration,
  formattedDurationType,
  formattedRunningWorkoutStepType,
} from "~/utils/misc";
import { Fieldset } from "./Fieldset";
import { Input } from "./Input";
import { Select } from "./Select";
import { SlideIn } from "./SlideIn";

type StepViewProps = {} & Omit<
  Prisma.RunningWorkoutStepCreateInput,
  "runningWorkout"
>;

export function StepView(props: StepViewProps): JSX.Element {
  const [isEditing, setIsEditing] = useState(false);
  const firstInputRef = useRef(null);
  const zo = useZorm("running-workout", RunningWorkoutStepSchema, {});

  // const { form, fields } = useForm({
  //   name: "running-workout-step",
  //   errors: actionData?.status === "error" ? actionData.errors : null,
  //   fieldMetadatas: loaderData.runningWorkoutStepFieldMetadatas,
  // });

  return (
    <>
      <div
        onClick={() => setIsEditing(true)}
        className="flex items-center justify-between rounded-md bg-white p-4 shadow-sm"
      >
        <div className="grid gap-2">
          <h3 className="font-bold text-teal-700">
            {formattedRunningWorkoutStepType(props.type)}
          </h3>
          <p className="flex gap-2">
            <span>{formattedDurationType(props.durationType)}</span>
            <span>
              {formattedDuration({
                durationType: props.durationType,
                durationValue: props.durationValue,
              })}
            </span>
          </p>
        </div>
        <div>
          <ChevronRightIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </div>
      </div>
      <SlideIn
        onClose={setIsEditing}
        isOpen={isEditing}
        title="Legg til steg"
        initialFocus={firstInputRef}
        isForm
        method="post"
        submitIntentValue="submit-step"
        replace
      >
        <Fieldset>
          <legend className="sr-only">Steg 1</legend>
          <input
            readOnly
            hidden
            name={zo.fields.id()}
            id={zo.fields.id("id")}
            defaultValue={props.id}
          />
          <input
            readOnly
            hidden
            name={zo.fields.durationType()}
            id={zo.fields.durationType("id")}
            defaultValue={props.durationType}
          />
          <Select
            label="Type"
            name={zo.fields.type()}
            id={zo.fields.type("id")}
            defaultValue={props.type}
          />
          <Input
            label="Varighet"
            ref={firstInputRef}
            name={zo.fields.durationValue()}
            id={zo.fields.durationValue("id")}
            defaultValue={props.durationValue}
            // errorMessage={}
          />
          <Input
            label="Mål"
            id={zo.fields.intensityTargetValue("id")}
            name={zo.fields.intensityTargetValue()}
            defaultValue={props.intensityTargetValue || undefined}
            // defaultValue={step.intensityTargetValue || undefined}
            //   errorMessage={actionData?.errors.title}
          />
        </Fieldset>
      </SlideIn>
    </>
  );
}
