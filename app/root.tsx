import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { getUser } from "./session.server";
import tailwindStylesheetUrl from "./styles/tailwind.css";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import isLeapYear from "dayjs/plugin/isLeapYear";
import "dayjs/locale/nb";

dayjs.extend(duration);
dayjs.extend(isLeapYear);
dayjs.locale("nb");

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Notes",
  "apple-mobile-web-app-status-bar-style": "black-translucent",
  viewport:
    "width=device-width,initial-scale=1,user-scalable=no,viewport-fit=cover",
});

export async function loader({ request }: LoaderArgs) {
  return json({
    user: await getUser(request),
  });
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-stone-100 text-slate-900 tap-highlight-none">
        <div id="__root">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
