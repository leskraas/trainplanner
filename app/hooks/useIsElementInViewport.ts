import type React from "react";
import { useState } from "react";
import { useLayoutEffect } from "./useLayoutEffect";

type Options = {
  isVisibleInitialStateIs?: boolean;
};

export function useIsElementInViewport<T extends HTMLElement>(
  elementRef?: React.RefObject<T>,
  options: Options = {}
) {
  const { isVisibleInitialStateIs = false } = options;
  const [isVisible, setIsVisible] = useState(isVisibleInitialStateIs);

  useLayoutEffect(() => {
    const element = elementRef?.current;
    if (element == null) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: "-70px" }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [elementRef]);

  return { isVisible };
}
