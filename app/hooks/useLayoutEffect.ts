import * as React from "react";

const canUseDOM = !!(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
);

export const useLayoutEffect = canUseDOM ? React.useLayoutEffect : () => {};
