import { Form } from "@remix-run/react";
import { motion, useInView, useIsPresent, usePresence } from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "~/components/Button";
import { useIsElementInViewport } from "~/hooks/useIsElementInViewport";

type MainPageProps = {
  title: string;
  children: ReactNode;
};

export function MainPage({ title, children }: MainPageProps): JSX.Element {
  const elementRef = useRef<HTMLHeadingElement>(null);
  // const isHeadingVibible = useInView(elementRef, {
  //   margin: "-40px 0px 0px 0px",
  // });
  // console.log({ lddd });

  const heading = useIsElementInViewport<HTMLDivElement>(elementRef, {
    isVisibleInitialStateIs: true,
  });
  return (
    <>
      <header
        className={twMerge(
          "sticky inset-x-0 top-0 flex items-center justify-between bg-opacity-30 p-4 pt-safe-top text-slate-900 backdrop-blur-lg backface-hidden",
          heading.isVisible && "bg-stone-100 bg-opacity-100"
        )}
      >
        <h2
          aria-hidden
          className={twMerge(
            "text-l font-bold transition-opacity duration-500",
            heading.isVisible ? "opacity-0" : "opacity-100"
          )}
        >
          {title}
        </h2>
        <Form action="/logout" method="post">
          <Button type="submit" variant="primary">
            Logout
          </Button>
        </Form>
      </header>
      <div className="">
        <h1
          ref={elementRef}
          className={twMerge(
            "text-3xl font-bold",
            heading.isVisible
              ? "opacity-100 transition-opacity delay-75 duration-500"
              : "opacity-0"
          )}
        >
          {title}
        </h1>
        {children}
      </div>
    </>
  );
}
