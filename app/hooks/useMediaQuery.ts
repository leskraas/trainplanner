import { useEffect, useState } from "react";

type UseMediaQueryArgs =
  | {
      from: number;
      to?: number;
      sm?: never;
      md?: never;
      lg?: never;
      xl?: never;
    }
  | {
      from?: number;
      to: number;
      sm?: never;
      md?: never;
      lg?: never;
      xl?: never;
    }
  | {
      from?: never;
      to?: never;
      sm: true;
      md?: never;
      lg?: never;
      xl?: never;
    }
  | {
      from?: never;
      to?: never;
      sm: never;
      md?: true;
      lg?: never;
      xl?: never;
    }
  | {
      from?: never;
      to?: never;
      sm: never;
      md?: never;
      lg?: true;
      xl?: never;
    }
  | {
      from?: never;
      to?: never;
      sm: never;
      md?: never;
      lg?: never;
      xl?: true;
    };

function getFromQuery(
  arg: Pick<UseMediaQueryArgs, "from" | "lg" | "md" | "sm" | "xl">
) {
  if (arg.sm) {
    return 640;
  }
  if (arg.md) {
    return 768;
  }
  if (arg.lg) {
    return 1024;
  }
  if (arg.xl) {
    return 1280;
  }
  return arg.from;
}

export function useMediaQuery({ to, ...args }: UseMediaQueryArgs) {
  const from = getFromQuery(args);
  const queryFrom = from ? `(min-width: ${from}px)` : null;
  const queryTo = to ? `(max-width: ${to}px)` : null;
  const query =
    queryFrom && queryTo
      ? `${queryFrom} and ${queryTo}`
      : queryFrom
      ? queryFrom
      : queryTo
      ? queryTo
      : "";

  const media =
    typeof document !== "undefined" ? window.matchMedia(query).matches : false;
  const [matches, setMatches] = useState(media);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => {
      setMatches(media.matches);
    };
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}
