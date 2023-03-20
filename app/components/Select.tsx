import { Listbox } from "@headlessui/react";
import type { ListboxProps } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { RunningStepType } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import type { InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type SelectProps = {
  label: string;
  defaultValue?: RunningStepType;
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "defaultValue" | "value" | "readOnly" | "hidden"
>;

const runningStepTypes = [
  {
    id: RunningStepType.WarmUp,
    name: "Oppvarming",
  },
  {
    id: RunningStepType.CoolDown,
    name: "Nedvarming",
  },
  {
    id: RunningStepType.Run,
    name: "Løp",
  },
  {
    id: RunningStepType.Rest,
    name: "Hvile",
  },
  {
    id: RunningStepType.Other,
    name: "Annet",
  },
];

export function Select({ label, defaultValue, ...rest }: SelectProps) {
  return (
    <>
      <Listbox
        defaultValue={
          runningStepTypes.find((stepType) => stepType.id === defaultValue) ||
          runningStepTypes[0]
        }
      >
        {({ open, value }) => (
          <>
            <input {...rest} value={value.id} readOnly hidden />
            <div className="relative rounded-md bg-white">
              <Listbox.Label className="absolute inset-y-0 ml-4 flex items-center text-gray-900">
                {label}
              </Listbox.Label>
              <Listbox.Button className="relative w-full cursor-default rounded-md py-2 pl-6 pr-10 text-left text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6">
                <span className="flex items-center justify-end">
                  <span className="ml-3 block truncate">{value.name}</span>
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>

              <AnimatePresence>
                {open && (
                  <Listbox.Options
                    as={motion.ul}
                    initial={{ opacity: 0.2, scaleX: 0.6, scaleY: 0 }}
                    animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
                    exit={{ opacity: 0.2, scaleX: 0.6, scaleY: 0 }}
                    static
                    className="absolute right-0 z-10 mt-1 max-h-56 origin-top-right overflow-hidden rounded-xl bg-white py-1 text-base shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                  >
                    {runningStepTypes.map((runningStepType) => (
                      <Listbox.Option
                        key={runningStepType.id}
                        as={motion.li}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={({ active }) =>
                          twMerge(
                            active ? "bg-teal-900 text-white" : "text-gray-900",
                            "relative cursor-default select-none py-2 pl-3 pr-9"
                          )
                        }
                        value={runningStepType}
                      >
                        {({ selected, active }) => (
                          <>
                            {selected ? (
                              <span
                                className={twMerge(
                                  active ? "text-white" : "text-gray-900",
                                  "absolute inset-y-0 flex items-center pr-4"
                                )}
                              >
                                <CheckIcon
                                  className="h-5 w-5  "
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                            <div className="flex items-center">
                              <span
                                className={twMerge(
                                  selected ? "font-semibold" : "font-normal",
                                  "ml-7 block truncate"
                                )}
                              >
                                {runningStepType.name}
                              </span>
                            </div>
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </Listbox>
    </>
  );
}
