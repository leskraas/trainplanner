import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { deletePlan, getPlan } from "~/models/plan.server";
import { requireUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.planId, "planId not found");

  const plan = await getPlan({ userId, id: params.planId });
  if (!plan) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ plan });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.planId, "planId not found");

  await deletePlan({ userId, id: params.planId });

  return redirect("/plan");
}

export default function PlanDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.plan.title}</h3>
      {data.plan.planRunningWorkouts.map((runningWorkout) => (
        <div key={runningWorkout.workout.id}>
          <p className="py-6">{runningWorkout.schedule}</p>
          <p className="py-6">{runningWorkout.workout.title}</p>
          <p className="py-6">{runningWorkout.workout.durationUnix}</p>
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
