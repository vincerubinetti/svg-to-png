import type { ComponentProps } from "react";
import { NumberField } from "@base-ui/react";
import clsx from "clsx";
import { ChevronDown, ChevronUp } from "lucide-react";

type Props = {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
} & Omit<ComponentProps<"input">, "value" | "onChange">;

export default function NumberBox({
  min = 1,
  max = 100,
  step = 1,
  value,
  onChange,
  className,
  ...props
}: Props) {
  return (
    <NumberField.Root
      min={min}
      max={max}
      step={step}
      value={value}
      onValueCommitted={(value) => {
        if (value !== null) onChange(value);
      }}
      className={clsx(
        "flex rounded-md border border-gray transition hover:border-theme",
        className,
      )}
    >
      <NumberField.Input className="min-h-10 min-w-10 p-2" {...props} />
      <div className="grid grid-rows-2 text-sm *:w-6 *:hover:text-theme">
        <NumberField.Increment
          render={
            <button>
              <ChevronUp />
            </button>
          }
        />
        <NumberField.Decrement
          render={
            <button>
              <ChevronDown />
            </button>
          }
        />
      </div>
    </NumberField.Root>
  );
}
