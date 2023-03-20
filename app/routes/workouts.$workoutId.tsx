import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getRunningWorkout } from "~/models/workout.server";
import { requireUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.workoutId, "workoutId not found");

  const runningWorkout = await getRunningWorkout({
    userId,
    id: params.workoutId,
  });
  if (!runningWorkout) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({
    runningWorkout,
  });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.planId, "planId not found");

  // await deletePlan({ userId, id: params.planId });

  return redirect("/plan");
}

export default function WorkoutDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.runningWorkout.title}</h3>
      {data.runningWorkout.steps.map((step) => (
        <div key={step.id}>
          <p className="py-6">{step.title}</p>
          <p className="py-6">{step.type}</p>
        </div>
      ))}
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Note not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
