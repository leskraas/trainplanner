import * as React from "react";
import {
  DurationType,
  IntensityTargetType,
  Prisma,
  RunningStepType,
} from "@prisma/client";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { Reorder } from "framer-motion";
// import { withZod } from "@remix-validated-form/with-zod";
import { useZorm, parseForm, createCustomIssues } from "react-zorm";
import invariant from "tiny-invariant";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { Button } from "~/components/Button";
import { Fieldset } from "~/components/Fieldset";
import { Input } from "~/components/Input";
import { StepView } from "~/components/StepView";
import {
  createRunningWorkout,
  getInitialRunningWorkout,
  updateRunningWorkout,
  updateRunningWorkoutStep,
} from "~/models/workout.server";
import { requireUserId } from "~/session.server";
import { preprocessFormData } from "~/utils/forms";

// type DD = Record<keyof Prisma.RunningWorkoutStepCreateInput, ZodTypeAny>;

export const RunningWorkoutStepSchema = z.object({
  type: zfd.text(z.nativeEnum(RunningStepType)),
  id: zfd.text(z.string().optional()),
  durationType: z.nativeEnum(DurationType),
  durationValue: zfd.numeric(),
  orderIndex: zfd.numeric(z.number().optional()),
  intensityTargetType: zfd.text(z.nativeEnum(IntensityTargetType).optional()),
  intensityTargetValue: zfd.numeric(z.number().optional()),
});

const RunningWorkoutSchema = z.object({
  title: zfd.text(),
  steps: zfd.repeatableOfType(
    z.object({
      id: zfd.text(z.string()),
      positionIndex: zfd.numeric(z.number()),
    })
  ),
});

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "submit-step") {
    const data = parseForm(RunningWorkoutStepSchema, formData);
    const issues = createCustomIssues(RunningWorkoutStepSchema);
    const { id, ...stepData } = data;
    invariant(id, "En uventet feil oppstod!");
    // const response = await updateRunningWorkoutStep({ id, ...stepData });
    console.log({ data, issues });
  }
  if (intent === "submit-workout") {
    const data = parseForm(RunningWorkoutSchema, formData);
    const issues = createCustomIssues(RunningWorkoutSchema);
    const ddd = await updateRunningWorkout();
    console.log({ data, issues });
  }

  // if (runningWorkoutStep) {

  //   return json({ status: "success" });
  // }

  // if (typeof title !== "string" || title.length === 0) {
  //   return json(
  //     { errors: { title: "Title is required", body: null } },
  //     { status: 400 }
  //   );
  // }

  // if (typeof body !== "string" || body.length === 0) {
  //   return json(
  //     { errors: { body: "Body is required", title: null } },
  //     { status: 400 }
  //   );
  // }

  // const workout = await createRunningWorkout({ title });

  // return redirect(`/workouts/${title}`);
  // if (!result.success) {
  //   return json(
  //     { status: "error", errors: result.error.flatten() },
  //     {
  //       status: 400,
  //     }
  //   );
  // }
  return json({ status: "success" });
}

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);

  const runningWorkout = await getInitialRunningWorkout({ userId });
  if (!runningWorkout) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({
    runningWorkout,
  });
}

export default function NewWorkoutPage() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [orderWorkoutSteps, setOrderWorkoutSteps] = React.useState(
    loaderData.runningWorkout.steps
  );

  const zo = useZorm("running-workout", RunningWorkoutSchema, {});

  return (
    <Form method="post" replace>
      <div className="grid w-full gap-4">
        <Fieldset>
          <Input
            defaultValue="Løpeøkt"
            label="Navn"
            name={zo.fields.title()}
            id={zo.fields.title("id")}
            classNameInput="text-lg font-medium"
            errorMessage={zo.errors.title()?.message}
          />
        </Fieldset>
        {/* {fields.steps} */}

        <Reorder.Group
          axis="y"
          className="contents"
          values={orderWorkoutSteps}
          onReorder={setOrderWorkoutSteps}
        >
          {orderWorkoutSteps.map((step, index) => (
            <Reorder.Item key={step.id} value={step}>
              <input
                readOnly
                hidden
                name={zo.fields.steps(index).id()}
                id={zo.fields.steps(index).id("id")}
                value={step.id}
              />
              <input
                readOnly
                hidden
                name={zo.fields.steps(index).positionIndex()}
                id={zo.fields.steps(index).positionIndex("id")}
                value={index}
              />
              <StepView {...step} />
            </Reorder.Item>
          ))}
        </Reorder.Group>
        <div className="flex gap-2">
          <Button type="button">Legg til steg</Button>
          <Button type="submit" name="intent" value="submit-workout">
            Lagre
          </Button>
        </div>
        {/* <StepView
          durationType="DistanceMeters"
          durationValue={1000}
          type="WarmUp"
        />
        <StepView
          durationType="TimeUnixSeconds"
          durationValue={360}
          type="Run"
        /> */}
      </div>
      {/* <SlideIn title="Legg til steg" initialFocus={firstInputRef}>
        <div className="">
          <Fieldset>
            <legend className="sr-only">Steg 1</legend>
            <Input
              ref={firstInputRef}
              label="Type"
              id="workout-when"
              errorMessage={actionData?.errors.title}
            />
            <Input
              label="Varighet"
              id="workout-when"
              errorMessage={actionData?.errors.title}
            />
            <Input
              label="Mål"
              id="workout-when"
              errorMessage={actionData?.errors.title}
            />
          </Fieldset>
        </div>
      </SlideIn> */}
      {/* 
      <fieldset className="rounded-md border-2 border-stone-300 p-2">
        <legend className="m-auto flex gap-2 p-4 text-stone-500">
          <span className="sr-only">Repeterer </span>
          <button type="button">-</button>
          <span>x3</span>
          <button type="button">+</button>
        </legend>

        <div className="mb-4 grid gap-4">
          <Fieldset>
            <Input
              label="Type"
              id="workout-when"
              errorMessage={actionData?.errors.title}
            />
            <Input
              label="Varighet"
              id="workout-when"
              errorMessage={actionData?.errors.title}
            />
            <Input
              label="Mål"
              id="workout-when"
              errorMessage={actionData?.errors.title}
            />
          </Fieldset>
          <Fieldset>
            <Input
              label="Type"
              id="workout-when"
              errorMessage={actionData?.errors.title}
            />
            <Input
              label="Varighet"
              id="workout-when"
              errorMessage={actionData?.errors.title}
            />
            <Input
              label="Mål"
              id="workout-when"
              errorMessage={actionData?.errors.title}
            />
          </Fieldset>
        </div>
        <Button>Legg til steg</Button>
      </fieldset> */}
      {/* <div className="flex gap-2">
        <Button>Legg til steg</Button>
        <Button>Legg til repeterende steg</Button>
      </div> */}
      {/* <Button>Legg til steg</Button> */}
    </Form>
  );
}
