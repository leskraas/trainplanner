import { Dialog } from "@headlessui/react";
import type { Variants } from "framer-motion";
import { useMotionValue, useTransform } from "framer-motion";
import { AnimatePresence, motion } from "framer-motion";
import type { MutableRefObject, ReactNode } from "react";
import { useRef } from "react";
import { useState } from "react";
import { Button } from "./Button";
import { useMediaQuery } from "~/hooks/useMediaQuery";
import type { FormProps } from "@remix-run/react";
import { Form } from "@remix-run/react";

const TRANSITIONS = {
  DURATION: 0.8,
  EASE: [0.32, 0.72, 0, 1],
};

type SlideInProps = {
  children: ReactNode;
  title: string;
  isOpen?: boolean;
  onClose(value: boolean): void;
  submitIntentValue?: string;
  initialFocus?: MutableRefObject<HTMLElement | null> | undefined;
} & ({ isForm?: never } | ({ isForm: true } & FormProps));

function getSlideInVariant(isTailwindSm: boolean): Variants {
  return isTailwindSm
    ? {
        initial: {
          translateX: "100%",
        },
        animate: {
          translateX: 0,
        },
        exit: {
          translateX: "100%",
        },
      }
    : {
        initial: {
          translateY: "100%",
        },
        animate: {
          translateY: 0,
        },
        exit: {
          translateY: "100%",
        },
      };
}

export function SlideIn({
  children,
  title,
  onClose,
  isOpen,
  isForm,
  submitIntentValue,
  initialFocus,
  ...rest
}: SlideInProps): JSX.Element {
  const [shouldClose, setShouldClose] = useState(false);
  const isTailwindSm = useMediaQuery({ sm: true });
  const y = useMotionValue(0);
  const backdropRef = useRef<HTMLDivElement>(null);
  const dragElementRef = useRef<HTMLDivElement>(null);
  const opacity = useTransform(
    y,
    (value) => 1 - value / (dragElementRef.current?.clientHeight || 0)
  );

  return (
    <>
      <AnimatePresence
        onExitComplete={() => {
          y.stop();
          y.set(0);
          setShouldClose(false);
          // document
          //   .querySelector('meta[name="theme-color"]')
          //   ?.removeAttribute("content");
        }}
      >
        {isOpen && (
          <Dialog
            as={isForm ? Form : "div"}
            {...(isForm ? { method: "post", replace: true } : {})}
            static
            open={isOpen}
            className="relative z-10"
            onClose={onClose}
            initialFocus={initialFocus}
            {...rest}
          >
            <motion.div
              style={{ opacity }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: TRANSITIONS.DURATION,
              }}
              ref={backdropRef}
              className="fixed inset-0 bg-gray-500/70 sm:bg-transparent"
            />
            <div className="fixed inset-0 overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={getSlideInVariant(isTailwindSm)}
                  ref={dragElementRef}
                  drag={!isTailwindSm && "y"}
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={{ bottom: 1 }}
                  dragTransition={
                    shouldClose
                      ? {
                          bounceStiffness: 1,
                        }
                      : { bounceStiffness: 300 }
                  }
                  style={{ y }}
                  onDragEnd={() => {
                    if (shouldClose) {
                      onClose(false);
                    }
                  }}
                  onDrag={() => {
                    if (opacity.get() < 1 / 2) {
                      return setShouldClose(true);
                    }
                    return setShouldClose(false);
                  }}
                  transition={{
                    duration: TRANSITIONS.DURATION,
                    ease: TRANSITIONS.EASE,
                  }}
                  className="pointer-events-none fixed bottom-0 top-10 right-0 flex max-w-full sm:top-0 sm:pl-10"
                >
                  <Dialog.Panel className="pointer-events-auto relative flex h-full w-screen flex-col overflow-y-auto rounded-t-lg bg-stone-100 py-6 shadow-xl sm:max-w-md sm:rounded-tr-none">
                    {!isTailwindSm && (
                      <div className="absolute top-2 left-1/2 h-1 w-16 -translate-x-1/2 translate-y-1/2 rounded-full bg-gray-400" />
                    )}
                    <div className="grid grid-cols-[1fr,auto,1fr] items-center px-4 sm:px-6">
                      <Button
                        className="justify-self-start"
                        onClick={() => onClose(false)}
                        variant="tertiary"
                        type="button"
                      >
                        Avbryt
                      </Button>
                      <Dialog.Title className="place-self-center font-semibold leading-6 text-gray-900">
                        {title}
                      </Dialog.Title>
                      <Button
                        name="intent"
                        value={submitIntentValue}
                        type={"submit"}
                        className="justify-self-end"
                        variant="tertiary"
                        onClick={() => console.log("hei")}
                      >
                        Lagre
                      </Button>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      {children}
                    </div>
                  </Dialog.Panel>
                </motion.div>
              </div>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}

// let cache = new Map<HTMLElement, CSSProperties>();

// function set(el?: HTMLElement | null, styles?: CSSProperties) {
//   let originalStyles = {};
//   if (!el || !styles) return;

//   Object.entries(styles).forEach(([key, value]) => {
//     originalStyles[key] = el.style[key];
//     el.style[key] = value;
//   });

//   cache.set(el, originalStyles);
// }

// function reset(el?: HTMLElement | null, prop?: keyof CSSProperties) {
//   if (!el) return;
//   let originalStyles = cache.get(el);
//   if (!originalStyles) return;

//   if (prop) {
//     el.style[prop] = originalStyles[prop];
//   } else {
//     Object.entries(originalStyles).forEach(([key, value]) => {
//       el.style[key] = value;
//     });
//   }
// }
