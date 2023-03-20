import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useOutlet,
} from "@remix-run/react";
import { useMediaQuery } from "~/hooks/useMediaQuery";
import { MainPage } from "~/layouts/mainPage";
import { getRunningWorkoutListItems } from "~/models/workout.server";
import { requireUserId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const runningWorkoutListItems = await getRunningWorkoutListItems({ userId });

  return json({ runningWorkoutListItems });
}

export default function WorkoutPage() {
  const data = useLoaderData<typeof loader>();
  const hasOutlet = !!useOutlet();
  const sm = useMediaQuery({ sm: true });
  const showSideMenu = hasOutlet ? sm : true;

  return (
    <MainPage title="Treingsøkter">
      <main className="flex h-full">
        {showSideMenu && (
          <div className="h-full w-80 border-r">
            <Link to="new" className="block p-4 text-xl text-blue-500">
              + New Note
            </Link>

            <hr />

            {data.runningWorkoutListItems.length === 0 ? (
              <p className="p-4">No notes yet</p>
            ) : (
              <ol>
                {data.runningWorkoutListItems.map((runningWorkoutListItem) => (
                  <li key={runningWorkoutListItem.id}>
                    <NavLink
                      className={({ isActive }) =>
                        `block border-b p-4 text-xl ${
                          isActive ? "bg-white" : ""
                        }`
                      }
                      to={runningWorkoutListItem.id}
                    >
                      📝 {runningWorkoutListItem.title}
                    </NavLink>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </MainPage>
  );
}
